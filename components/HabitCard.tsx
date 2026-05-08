import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export const Rarities = {
  Comum: {
    name: 'Comum',
    bg: '#FFFFFF',
    btn: '#3B82F6',
    xpMultiplier: 1,
    hpDamageMultiplier: 5,
    borderColor: '#3B82F6',
  },
  Raro: {
    name: 'Raro',
    bg: '#FEF3C7',
    btn: '#D97706',
    xpMultiplier: 2,
    hpDamageMultiplier: 15,
    borderColor: '#D97706',
  },
  Lendario: {
    name: 'Lendário',
    bg: '#EDE9FE',
    btn: '#7C3AED',
    xpMultiplier: 5,
    hpDamageMultiplier: 40,
    borderColor: '#7C3AED',
  }
};

export const isCompletedToday = {
  name: 'Completo',
  bg: '#D1FAE5',
  btn: '#10B981',
  borderColor: '#10B981',
}

interface HabitCardProps {
    id: number,
    title: string;
    description?: string,
    xpReward: number,
    hpDamage: number,
    isCompleted: boolean,
    onCheck: (id: number, xp: number) => void;
    rarityType: keyof typeof Rarities;
    onDelete: (id: number) => void;
}

export function HabitCard({ id, title, description, xpReward, hpDamage, isCompleted, onCheck, rarityType, onDelete }: HabitCardProps) {
  const rarity = Rarities[rarityType] || Rarities.Comum;
  const finalXpReward = xpReward * rarity.xpMultiplier;
  const finalHpDamage = hpDamage * rarity.hpDamageMultiplier;
  const finalRarity = isCompleted ? isCompletedToday : rarity;

  return (
    <View className="p-5 mb-3 border-x border-y" style={{ backgroundColor: finalRarity.bg, borderColor: finalRarity.borderColor}}>
        <View className="flex-row items-center">
            <Text className={`${isCompleted ? "text-green-500" : "text-black"} font-semibold`}>{title}</Text>
            <Text className="ml-2" style={{ color: finalRarity.btn }}>- {finalRarity.name}</Text>
        </View>
        <View className="flex-row items-center">
            <Text>{finalXpReward} XP ⭐</Text>
            <Text className="ml-4">-{finalHpDamage} HP ❤️</Text>
            {!isCompleted && (
              <TouchableOpacity className="text-white font-bold py-3 px-6 rounded mt-2 ml-auto" style={{ backgroundColor: finalRarity.btn }} 
              onPress={() => onCheck(id, finalXpReward)} disabled={isCompleted}>
                <Text className="text-white font-bold">Check-in</Text>
              </TouchableOpacity>
            )}
            {isCompleted && (
                <TouchableOpacity className="bg-red-500 text-white font-bold py-3 px-6 rounded mt-2 ml-auto" onPress={() => onDelete(id)}>
                    <Text className="text-white font-bold">Excluir</Text>
                </TouchableOpacity>
            )}
        </View>
    </View>
  );
}