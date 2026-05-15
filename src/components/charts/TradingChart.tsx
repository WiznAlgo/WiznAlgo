"use client";

import { useEffect, useRef, useCallback } from "react";
import {
  createChart,
  type IChartApi,
  ColorType,
  type CandlestickData,
  type Time,
  type HistogramData,
  CandlestickSeries,
  HistogramSeries,
} from "lightweight-charts";
import { generateCandles } from "@/lib/market-data";
import { useMarketStore } from "@/store/market-store";

interface TradingChartProps {
  height?: number;
  showVolume?: boolean;
  mini?: boolean;
  pairOverride?: string;
}

export default function TradingChart({ height = 500, showVolume = true, mini = false, pairOverride }: TradingChartProps) {
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

    const candles = generateCandles(pair, mini ? 50 : 200, selectedTimeframe);
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

    chart.timeScale().fitContent();
    chartRef.current = chart;
  }, [pair, selectedTimeframe, height, showVolume, mini]);

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
