import { Text, View } from 'react-native';

interface ProgressBarProps {
  label: string;
  currentValue: number;
  maxValue: number;
  color: string;
}

function darkenColor(hex: string, percent: number): string {
  let color = hex.replace('#', '');
  
  let r = parseInt(color.substring(0, 2), 16);
  let g = parseInt(color.substring(2, 4), 16);
  let b = parseInt(color.substring(4, 6), 16);

  r = Math.floor((r * (100 - percent)) / 100);
  g = Math.floor((g * (100 - percent)) / 100);
  b = Math.floor((b * (100 - percent)) / 100);

  const rHex = r.toString(16).padStart(2, '0');
  const gHex = g.toString(16).padStart(2, '0');
  const bHex = b.toString(16).padStart(2, '0');

  return `#${rHex}${gHex}${bHex}`;
}

function lighterColor(hex: string, percent: number): string {
  let color = hex.replace('#', '');
  
  let r = parseInt(color.substring(0, 2), 16);
  let g = parseInt(color.substring(2, 4), 16);
  let b = parseInt(color.substring(4, 6), 16);


  r = Math.floor(r + (255 - r) * (percent / 100));
  g = Math.floor(g + (255 - g) * (percent / 100));
  b = Math.floor(b + (255 - b) * (percent / 100));

  const rHex = r.toString(16).padStart(2, '0');
  const gHex = g.toString(16).padStart(2, '0');
  const bHex = b.toString(16).padStart(2, '0');

  return `#${rHex}${gHex}${bHex}`;
}

export function ProgressBar({ label, currentValue, maxValue, color }: ProgressBarProps) {
  const percentage = Math.min(Math.max((currentValue / maxValue) * 100, 0), 100);
  const darkerColor = darkenColor(color, 40);
  const finalTextColor = darkenColor(color, 60);
  const bgColor = lighterColor(color, 85);

  return (
    <View className="mb-2 w-full">
      <Text className="self-end text-[16px] p-1" style={{ color: finalTextColor }}>{label}: {currentValue}/{maxValue}</Text>
      <View className="overflow-hidden bg-gray-200 border h-[30px] p-1 rounded-[5px]" style={{ borderColor: darkerColor, backgroundColor: bgColor}}>
        <View className="h-full rounded-[4px]" style={{ width: `${percentage}%`, backgroundColor: color }} />
      </View>
    </View>
  );
}
