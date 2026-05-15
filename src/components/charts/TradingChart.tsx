"use client";

import { useEffect, useRef, useCallback } from "react";
import {
  createChart,
  type IChartApi,
  ColorType,
  type CandlestickData,
  type Time,
  type HistogramData,
  type LineData,
  CandlestickSeries,
  HistogramSeries,
  LineSeries,
} from "lightweight-charts";
import { generateCandles, computeVWAPBands, type CandleData } from "@/lib/market-data";
import { useMarketStore } from "@/store/market-store";

interface TradingChartProps {
  height?: number;
  showVolume?: boolean;
  mini?: boolean;
  pairOverride?: string;
  showVWAP?: boolean;
  slLine?: number;
  tpLine?: number;
  liveCandles?: CandleData[];
}

export default function TradingChart({
  height = 500,
  showVolume = true,
  mini = false,
  pairOverride,
  showVWAP = false,
  slLine,
  tpLine,
  liveCandles,
}: TradingChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const { selectedPair, selectedTimeframe } = useMarketStore();
  const pair = pairOverride ?? selectedPair;

  const initChart = useCallback(() => {
    if (!containerRef.current) return;
    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
    }

    const chart = createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height,
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "#8892a4",
        fontSize: mini ? 10 : 12,
      },
      grid: {
        vertLines: { color: "rgba(0, 212, 255, 0.04)" },
        horzLines: { color: "rgba(0, 212, 255, 0.04)" },
      },
      crosshair: {
        vertLine: { color: "rgba(0, 212, 255, 0.3)", width: 1, style: 2 },
        horzLine: { color: "rgba(0, 212, 255, 0.3)", width: 1, style: 2 },
      },
      rightPriceScale: {
        borderColor: "rgba(0, 212, 255, 0.1)",
        scaleMargins: { top: 0.1, bottom: showVolume ? 0.25 : 0.1 },
      },
      timeScale: {
        borderColor: "rgba(0, 212, 255, 0.1)",
        timeVisible: true,
        secondsVisible: false,
      },
    });

    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#00ff88",
      downColor: "#ff3b5c",
      borderUpColor: "#00ff88",
      borderDownColor: "#ff3b5c",
      wickUpColor: "#00ff88",
      wickDownColor: "#ff3b5c",
    });

    const candles = liveCandles && liveCandles.length > 0
      ? liveCandles
      : generateCandles(pair, mini ? 50 : 200, selectedTimeframe);

    const candleData: CandlestickData<Time>[] = candles.map((c) => ({
      time: c.time as Time,
      open: c.open,
      high: c.high,
      low: c.low,
      close: c.close,
    }));
    candleSeries.setData(candleData);

    if (showVolume && !mini) {
      const volumeSeries = chart.addSeries(HistogramSeries, {
        priceFormat: { type: "volume" },
        priceScaleId: "volume",
      });
      chart.priceScale("volume").applyOptions({
        scaleMargins: { top: 0.8, bottom: 0 },
      });
      const volData: HistogramData<Time>[] = candles.map((c) => ({
        time: c.time as Time,
        value: c.volume,
        color: c.close >= c.open ? "rgba(0, 255, 136, 0.3)" : "rgba(255, 59, 92, 0.3)",
      }));
      volumeSeries.setData(volData);
    }

    if (showVWAP && !mini) {
      const bands = computeVWAPBands(candles);

      const vwapSeries = chart.addSeries(LineSeries, {
        color: "#00d4ff",
        lineWidth: 2,
        priceLineVisible: false,
        lastValueVisible: false,
      });
      vwapSeries.setData(bands.vwap.map((d) => ({ time: d.time as Time, value: d.value })) as LineData<Time>[]);

      const u1Series = chart.addSeries(LineSeries, {
        color: "rgba(0, 212, 255, 0.3)",
        lineWidth: 1,
        lineStyle: 2,
        priceLineVisible: false,
        lastValueVisible: false,
      });
      u1Series.setData(bands.upper1.map((d) => ({ time: d.time as Time, value: d.value })) as LineData<Time>[]);

      const l1Series = chart.addSeries(LineSeries, {
        color: "rgba(0, 212, 255, 0.3)",
        lineWidth: 1,
        lineStyle: 2,
        priceLineVisible: false,
        lastValueVisible: false,
      });
      l1Series.setData(bands.lower1.map((d) => ({ time: d.time as Time, value: d.value })) as LineData<Time>[]);

      const u2Series = chart.addSeries(LineSeries, {
        color: "rgba(124, 58, 237, 0.4)",
        lineWidth: 1,
        lineStyle: 3,
        priceLineVisible: false,
        lastValueVisible: false,
      });
      u2Series.setData(bands.upper2.map((d) => ({ time: d.time as Time, value: d.value })) as LineData<Time>[]);

      const l2Series = chart.addSeries(LineSeries, {
        color: "rgba(124, 58, 237, 0.4)",
        lineWidth: 1,
        lineStyle: 3,
        priceLineVisible: false,
        lastValueVisible: false,
      });
      l2Series.setData(bands.lower2.map((d) => ({ time: d.time as Time, value: d.value })) as LineData<Time>[]);
    }

    if (tpLine != null) {
      const tpSeries = chart.addSeries(LineSeries, {
        color: "#00ff88",
        lineWidth: 2,
        lineStyle: 2,
        priceLineVisible: false,
        lastValueVisible: true,
        title: "TP",
      });
      tpSeries.setData(candles.map((c) => ({ time: c.time as Time, value: tpLine })) as LineData<Time>[]);
    }

    if (slLine != null) {
      const slSeries = chart.addSeries(LineSeries, {
        color: "#ff3b5c",
        lineWidth: 2,
        lineStyle: 2,
        priceLineVisible: false,
        lastValueVisible: true,
        title: "SL",
      });
      slSeries.setData(candles.map((c) => ({ time: c.time as Time, value: slLine })) as LineData<Time>[]);
    }

    chart.timeScale().fitContent();
    chartRef.current = chart;
  }, [pair, selectedTimeframe, height, showVolume, mini, showVWAP, slLine, tpLine, liveCandles]);

  useEffect(() => {
    initChart();

    const handleResize = () => {
      if (chartRef.current && containerRef.current) {
        chartRef.current.applyOptions({ width: containerRef.current.clientWidth });
      }
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, [initChart]);

  return <div ref={containerRef} className="w-full" />;
}
