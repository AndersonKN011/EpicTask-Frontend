import Ionicons from '@expo/vector-icons/Ionicons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Modal, RefreshControl, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createHabit, deleteHabit, getHabits, getPlayer, habitDone } from '../../api';
import { HabitCard, ProgressBar } from '../../components';

type Rarity = 'Comum' | 'Raro' | 'Lendario';

export default function Index() {

  const queryClient = useQueryClient();

  const {data: player, refetch: refetchPlayer, isFetched: isFetchingPlayer } = useQuery({
    queryKey: ['player'],
    queryFn: getPlayer,
  });

  const {data: habits, refetch: refetchHabits, isFetched: isFetchingHabits } = useQuery({
    queryKey: ['habits'],
    queryFn: getHabits,
    select: (data) => {
      return data.map(habit => {
        const rarity = (habit.xp_reward === 50 ? 'Lendario' : habit.xp_reward === 20 ? 'Raro' : 'Comum') as Rarity;
        return {
          ...habit,
          rarity,
        };
      });
    }
  });

  const onRefresh = async () => {
    setOnRefreshLoading(true);
    try {
      await refetchPlayer();
      await refetchHabits();
    } catch (error) {
      console.error('Erro ao atualizar dados:', error);
    } finally {
      setOnRefreshLoading(false);
    }
  };

  const [title, setTitle] = useState('');
  const [name, setName] = useState('');
  const [xpReward, setXpReward] = useState(10);
  const [hpDamage, setHpDamage] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRarity, setSelectedRarity] = useState<Rarity>('Comum');
  const [onRefreshLoading, setOnRefreshLoading] = useState(false);

  const addHabit = async (title: string, rarity: Rarity) => {
    try {
      await createHabit(title, rarity);
      queryClient.invalidateQueries({ queryKey: ['habits'] });
      setTitle('');
      setSelectedRarity('Comum');
      setIsModalVisible(false);
    } catch (error) {
      console.error(error);
    }
  };

  const SelectionComponent = ({label, options}: {label: string; options: Rarity[]}) => {
    return (
      <View>
        <Text className="text-lg font-bold mb-2">{label}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
          {options.map((option) => (
            <TouchableOpacity className={`p-3 mr-2 rounded ${selectedRarity === option ? "bg-blue-500" : "bg-gray-300"}`} key={option} onPress={() => setSelectedRarity(option)}>
              <Text className={`${selectedRarity === option ? "text-white" : "text-black"}`}>{option}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  }

  const { mutate: checkIn } = useMutation({
    mutationFn: (id: number) => habitDone(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['player'] });
      queryClient.invalidateQueries({ queryKey: ['habits'] });
    }
  });

  const handleCheck = (id: number, xp: number) => {
    checkIn(id);
  };

  const handleDelete = (id: number) => {
    deleteHabit(id).then(() => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="w-full bg-gray-300 flex-row p-4">
        <TouchableOpacity className='w-[20%] h-20 mr-4 bg-yellow-300 rounded-full'>
          <View/>
        </TouchableOpacity>
        <View className='w-[80%]'>
          <Text className="text-lg mb-1 text-black">
          {name}
          </Text>
          <Text className='text-center text-[20px] font-bold'>Level {player?.level}</Text>
        </View>
      </View>
      <View className="w-full bg-white p-4 items-center">
        <ProgressBar label="Vida" currentValue={player?.current_hp} maxValue={100} color="#ff1e00" />
        <ProgressBar label="XP" currentValue={player?.current_xp} maxValue={100} color="#00ff00" />
      </View>
      <ScrollView className="flex-1 p-4" refreshControl={<RefreshControl refreshing={onRefreshLoading} onRefresh={onRefresh} />}>
        {habits?.map((habit) => (
          <HabitCard key={habit.id} id={habit.id} title={habit.title} xpReward={xpReward} hpDamage={hpDamage} isCompleted={habit.isCompletedToday} onCheck={handleCheck} rarityType={habit.rarity} onDelete={handleDelete}/>
        ))}
      </ScrollView>
      <TouchableOpacity className='absolute bottom-10 self-center bg-blue-500 p-4 shadow-lg rounded-[16px]' onPress={() => setIsModalVisible(true)}>
        <Ionicons name="add" size={32} color="white"/>
      </TouchableOpacity>
      <Modal animationType="fade" transparent={true} visible={isModalVisible} onRequestClose={() => setIsModalVisible(false)}>
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-4 rounded-lg w-[85%]">
            <Text className="text-lg font-bold mb-4">Adicionar Hábito</Text>
            <TextInput className="border p-2 mb-4 rounded" placeholder="Título do Hábito" value={title} onChangeText={setTitle} />
            <SelectionComponent label="Raridade" options={['Comum', 'Raro', 'Lendario']} />  
            <TouchableOpacity className="bg-blue-500 py-3 px-6 rounded mt-4 self-end" onPress={() => {addHabit(title, selectedRarity);}}>
              <Text className="text-white font-bold">Salvar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}