const API_URL = "https://epictask-backend-40m0.onrender.com";

interface Habit {
    id: number;
    title: string;
    description: string;
    xp_reward: number;
    hp_damage: number;
    isCompletedToday: boolean;
}

export const getPlayer = async () => {
    try {
        const response = await fetch(API_URL + "/player/profile");
        return await response.json();
    } catch (error) {
        console.error('Erro ao buscar dados do jogador:', error);
        throw error;
    }
};

export const habitDone = async (id: number) => {
    try {
        const response = await fetch(API_URL + "/player/profile/" + id + "/check", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: id })
        });
        return true;
    } catch (error) {
        console.error('Erro ao marcar hábito como feito:', error);
        throw error;
    }
};

export const getHabits = async () => {
    try {
        const response = await fetch(API_URL + "/habit");
        const habits: Habit[] = await response.json();

        const habitsRarity = habits.map(habit => ({
            ...habit,
            rarity: habit.xp_reward === 50 ? 'Lendario' : habit.xp_reward === 20 ? 'Raro' : 'Comum'
        }));
        return habitsRarity;
    } catch (error) {
        console.error('Erro ao buscar hábitos:', error);
        throw error;
    }
};

export const createHabit = async (title: string, rarity: 'Comum' | 'Raro' | 'Lendario') => {
    const xpReward = rarity === 'Lendario' ? 50 : rarity === 'Raro' ? 20 : 10;
    const hpDamage = rarity === 'Lendario' ? 40 : rarity === 'Raro' ? 15 : 5;
    try {
        const response = await fetch(API_URL + "/habit", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                title: title,
                xp_reward: xpReward,
                hp_damage: hpDamage
            })
        });
        return response.json();
    }
    catch (error) {
        console.error('Erro ao criar hábito:', error);
        throw error;
    }
};

export const deleteHabit = async (id: number) => {
    try {
        await fetch(API_URL + "/habit/" + id, {
            method: 'DELETE'
        });
    } catch (error) {
        console.error('Erro ao excluir hábito:', error);
        throw error;
    }
};
