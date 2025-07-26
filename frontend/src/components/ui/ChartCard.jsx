import { motion } from "framer-motion";
import { Card } from "./index";

const ChartCard = ({
  title,
  description,
  data = [],
  type = "bar",
  className = "",
  height = "200px",
}) => {
  const maxValue = Math.max(...data.map((item) => item.value));

  const renderBarChart = () => (
    <div className="flex items-end justify-between h-full space-x-2">
      {data.map((item, index) => (
        <motion.div
          key={item.label}
          className="flex-1 flex flex-col items-center space-y-2"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
        >
          <div
            className="w-full bg-gray-100 rounded-t-lg flex items-end"
            style={{ height: "150px" }}
          >
            <motion.div
              className="w-full bg-gradient-to-t from-primary-500 to-primary-400 rounded-t-lg relative group"
              style={{
                height: `${(item.value / maxValue) * 100}%`,
                minHeight: "4px",
              }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {item.value}
              </div>
            </motion.div>
          </div>
          <span className="text-xs text-gray-600 text-center">
            {item.label}
          </span>
        </motion.div>
      ))}
    </div>
  );

  const renderLineChart = () => {
    const points = data
      .map((item, index) => {
        const x = (index / (data.length - 1)) * 100;
        const y = 100 - (item.value / maxValue) * 80; // Leave 20% padding
        return `${x},${y}`;
      })
      .join(" ");

    return (
      <div className="relative" style={{ height: "150px" }}>
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Grid lines */}
          {[20, 40, 60, 80].map((y) => (
            <line
              key={y}
              x1="0"
              y1={y}
              x2="100"
              y2={y}
              stroke="#f3f4f6"
              strokeWidth="0.5"
            />
          ))}

          {/* Line */}
          <motion.polyline
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="2"
            points={points}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />

          {/* Points */}
          {data.map((item, index) => {
            const x = (index / (data.length - 1)) * 100;
            const y = 100 - (item.value / maxValue) * 80;
            return (
              <motion.circle
                key={index}
                cx={x}
                cy={y}
                r="2"
                fill="#059669"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 + 0.5 }}
                className="hover:r-3 transition-all duration-200"
              />
            );
          })}

          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop
                offset="0%"
                style={{ stopColor: "#059669", stopOpacity: 1 }}
              />
              <stop
                offset="100%"
                style={{ stopColor: "#10b981", stopOpacity: 1 }}
              />
            </linearGradient>
          </defs>
        </svg>

        {/* Labels */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between">
          {data.map((item, index) => (
            <span key={index} className="text-xs text-gray-600">
              {item.label}
            </span>
          ))}
        </div>
      </div>
    );
  };

  const renderPieChart = () => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = 0;
    const radius = 45;
    const centerX = 50;
    const centerY = 50;

    const colors = ["#059669", "#10b981", "#34d399", "#6ee7b7", "#a7f3d0"];

    return (
      <div className="flex items-center space-x-6">
        <div className="relative" style={{ width: "150px", height: "150px" }}>
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full transform -rotate-90"
          >
            {data.map((item, index) => {
              const sliceAngle = (item.value / total) * 360;
              const startAngle = currentAngle;
              const endAngle = currentAngle + sliceAngle;

              const startX =
                centerX + radius * Math.cos((startAngle * Math.PI) / 180);
              const startY =
                centerY + radius * Math.sin((startAngle * Math.PI) / 180);
              const endX =
                centerX + radius * Math.cos((endAngle * Math.PI) / 180);
              const endY =
                centerY + radius * Math.sin((endAngle * Math.PI) / 180);

              const largeArcFlag = sliceAngle > 180 ? 1 : 0;

              const pathData = [
                `M ${centerX} ${centerY}`,
                `L ${startX} ${startY}`,
                `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`,
                "Z",
              ].join(" ");

              currentAngle += sliceAngle;

              return (
                <motion.path
                  key={index}
                  d={pathData}
                  fill={colors[index % colors.length]}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="hover:opacity-80 transition-opacity duration-200"
                />
              );
            })}
          </svg>
        </div>

        <div className="space-y-2">
          {data.map((item, index) => {
            const percentage = ((item.value / total) * 100).toFixed(1);
            return (
              <div key={index} className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: colors[index % colors.length] }}
                />
                <span className="text-sm text-gray-700">
                  {item.label}: {percentage}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderChart = () => {
    switch (type) {
      case "line":
        return renderLineChart();
      case "pie":
        return renderPieChart();
      default:
        return renderBarChart();
    }
  };

  return (
    <Card className={`${className}`}>
      <Card.Header>
        <Card.Title>{title}</Card.Title>
        {description && <Card.Description>{description}</Card.Description>}
      </Card.Header>

      <Card.Content>
        <div style={{ height }}>
          {data.length > 0 ? (
            renderChart()
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <div className="text-4xl mb-2">📊</div>
                <p>No data available</p>
              </div>
            </div>
          )}
        </div>
      </Card.Content>
    </Card>
  );
};

export default ChartCard;
