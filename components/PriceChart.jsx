'use client';
import { getPriceHistory } from '@/lib/action';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingDown, TrendingUp, Minus } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg p-3">
        <p className="text-xs text-gray-500 mb-1">
          {new Date(payload[0].payload.checked_at).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
        <p className="text-lg font-semibold text-gray-900">
          {payload[0].payload.currancy} {payload[0].value?.toFixed(2)}
        </p>
      </div>
    );
  }
  return null;
};

export const PriceChart = ({ productId }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPriceHistory() {
      setLoading(true);
      const { data, error } = await getPriceHistory(productId);
      if (error) {
        console.error("Error fetching price history:", error);
        setLoading(false);
        return;
      }
      setData(data || []);
      setLoading(false);
    }

    fetchPriceHistory();
  }, [productId]);

  // Calculate stats
  const prices = data.map(d => d.price).filter(Boolean);
  const currentPrice = prices[prices.length - 1] || 0;
  const previousPrice = prices[prices.length - 2] || currentPrice;
  const lowestPrice = Math.min(...prices) || 0;
  const highestPrice = Math.max(...prices) || 0;
  const averagePrice = prices.length ? (prices.reduce((a, b) => a + b, 0) / prices.length) : 0;
  const priceChange = currentPrice - previousPrice;
  const priceChangePercent = previousPrice ? ((priceChange / previousPrice) * 100) : 0;

  const getTrendIcon = () => {
    if (priceChange > 0) return <TrendingUp className="w-4 h-4 text-red-500" />;
    if (priceChange < 0) return <TrendingDown className="w-4 h-4 text-green-500" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const getTrendColor = () => {
    if (priceChange > 0) return 'text-red-500';
    if (priceChange < 0) return 'text-green-500';
    return 'text-gray-500';
  };

  // Format date for X-axis
  const formatXAxis = (tickItem) => {
    if (!tickItem) return '';
    const date = new Date(tickItem);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="h-[400px] flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-gray-500">Loading price history...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-gray-500">No price history available yet</p>
        </CardContent>
      </Card>
    );
  }

  const currency = data[0]?.currancy || 'USD';

  return (
    <Card className="w-full overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-800">
            Price History
          </CardTitle>
          <div className="flex items-center gap-1">
            {getTrendIcon()}
            <span className={`text-sm font-medium ${getTrendColor()}`}>
              {priceChange >= 0 ? '+' : ''}{priceChangePercent.toFixed(1)}%
            </span>
          </div>
        </div>
        
        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="text-center p-2 bg-green-50 rounded-lg">
            <p className="text-xs text-gray-500">Lowest</p>
            <p className="text-sm font-semibold text-green-600">
              {currency} {lowestPrice.toFixed(2)}
            </p>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500">Average</p>
            <p className="text-sm font-semibold text-gray-700">
              {currency} {averagePrice.toFixed(2)}
            </p>
          </div>
          <div className="text-center p-2 bg-red-50 rounded-lg">
            <p className="text-xs text-gray-500">Highest</p>
            <p className="text-sm font-semibold text-red-600">
              {currency} {highestPrice.toFixed(2)}
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-4">
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.4} />
                  <stop offset="50%" stopColor="#8b5cf6" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#e5e7eb" 
                vertical={false}
              />
              <XAxis 
                dataKey="checked_at" 
                tickFormatter={formatXAxis}
                stroke="#9ca3af"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#e5e7eb' }}
                dy={10}
              />
              <YAxis 
                stroke="#9ca3af"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${currency} ${value}`}
                width={80}
                domain={['dataMin - 5', 'dataMax + 5']}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine 
                y={averagePrice} 
                stroke="#9ca3af" 
                strokeDasharray="5 5" 
                strokeWidth={1}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke="#8b5cf6"
                strokeWidth={2.5}
                fill="url(#priceGradient)"
                dot={false}
                activeDot={{ 
                  r: 6, 
                  fill: '#8b5cf6', 
                  stroke: '#fff', 
                  strokeWidth: 2 
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-4 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-purple-500 rounded" />
            <span>Price</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-gray-400 rounded border-dashed" style={{ borderTop: '1px dashed #9ca3af' }} />
            <span>Average</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
