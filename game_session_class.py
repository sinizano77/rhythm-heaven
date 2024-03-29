import random
from player_class import Player
from mini_game_class import Minigame

class Round:
    def __init__(self, ordered_player_list : list[Player]):
        self._ordered_player_list = ordered_player_list
        self._point_total = 0.00

class GameSession: 

    def __init__(self, player_list : list[Player], rounds : int, game_ver : int, probabilities: list[str], selected_rh_games : list[Minigame], scoring: dict(), game_pool: int):
        self._player_list = player_list
        self._rounds = rounds
        self._game_ver = game_ver
        self._probabilities = probabilities
        self._selected_rh_games = selected_rh_games
        self._scoring = scoring
        self._game_pool = game_pool
        self._current_players_left = player_list[:]
        self._next_round_players = player_list[:]
        self._curr_rounds = 1
        self._chosen_players_for_turn = list()
        self._temp_removed_player = list() #[Player, 'current/next']
        self._total_probability = 100 #this number decreases for every option that gets pulled out of self._probabilities
    
    def get_round(self):
        return self._curr_rounds
    
    def get_remaining_players_in_round(self):
        return len(self._current_players_left)
    
    def should_have_next_round(self):
        return self._curr_rounds <= self._rounds
    
    def get_turn_total(self):
        return len(self._player_list)
    
    def start_round(self):
        print('start round')
        print(self._next_round_players)
        self._current_players_left = self._next_round_players
        if (self._rounds > self._curr_rounds):
            print('next round players instituted')
            self._next_round_players = self._player_list[:]
            print(self._next_round_players)
        else:
            print('next round players are empty')
            self._next_round_players = list()
    
    def end_round(self):
        self._curr_rounds += 1
        
    def get_next_player(self):
        if len(self._current_players_left) > 0:
            return self._current_players_left[0]
        return None
    
    def get_players_for_turn(self, skipped: bool) -> None:
        print('in get player for turn function')
        if not skipped:
            print('did not skip')
            self._chosen_players_for_turn = list()
            print('current player list:')
            print(self._current_players_left)
            print(self._next_round_players)
            self._chosen_players_for_turn.append(self._current_players_left[0])
            del self._current_players_left[0]
        elif len(self._temp_removed_player) == 2:
            # need to put temp player back if they exist
            if self._temp_removed_player[1] == 'current':
                self._current_players_left.append(self._temp_removed_player[0])
                print([player.get_name() for player in self._current_players_left])
            else:
                self._next_round_players.append(self._temp_removed_player[0])
            print('temp player returned back to pool cuz randomize')
            del self._chosen_players_for_turn[1]
            self._temp_removed_player.clear()

        # get second player on standby
        all_available_players = list(set([player.get_id() for player in self._current_players_left] + [player.get_id() for player in self._next_round_players if player.get_id() != self._chosen_players_for_turn[0].get_id()]))
        print('before if statement to check all available players')
        print(all_available_players)
        if (len(all_available_players) != 0):
            print('in if statement')
            random_index = random.randint(0, len(all_available_players) - 1)
            second_player_id = all_available_players[random_index]
            for player in self._player_list:
                if player.get_id() == second_player_id:
                    print('found player 2')
                    print(second_player_id)
                    self._chosen_players_for_turn.append(player)
                    break

    # needed second player
    def remove_player_from_pool(self) -> None:
        print('temporariliy removing second player')
        player = self._chosen_players_for_turn[1]
        self._temp_removed_player.append(player)
        print(player.get_name())
        if player in self._current_players_left:
            self._temp_removed_player.append('current')
            self._current_players_left.remove(player)
        else:
            self._temp_removed_player.append('next')
            self._next_round_players.remove(player)
            print('next round player removed')

    
    # print scores from highest to lowest    
    def get_standings(self) -> list:
        print(self._player_list)
        return sorted((x for x in self._player_list), key=lambda x: x.get_points() * -1)

    # get game with probability calculations
    # WEIGHTED PROB DOESN'T WORK. WHAT IF THAT CATEGORY WAS COMPLETELY CHOSEN FROM?
    # you can't delete when the length is 1. What happens if we skip the game? You're gonna need it back
    def get_game(self) -> Minigame:
        # used for calculating weighted probability
        # get a number between 1 - 100 and if that number falls in a category, choose sth from that category
        prob_index = random.randint(1, self._total_probability)
        prob_total = 0
        probability_data_list_index = 0
        while (prob_total < prob_index):
            print(self._probabilities[probability_data_list_index].split(":"))
            prob_val = int(self._probabilities[probability_data_list_index].split(":")[1])
            if (prob_val > 0):
                prob_total += prob_val
            if (prob_total >= prob_index):
                break
            probability_data_list_index+=1
        
        category_name = self._probabilities[probability_data_list_index].split(":")[0]
        filtered_games = [game for game in self._selected_rh_games if game.get_category() == category_name]
        index = 0
        if len(filtered_games) > 1:
            index = random.randint(0, len(filtered_games) - 1)
        print('game selected: ')
        print(filtered_games[index].get_game_name())
        return filtered_games[index]
    
    def delete_game(self, game):
        category = game.get_category()
        index = 0
        prob_amt = 0
        filtered_games = [game_selected for game_selected in self._selected_rh_games if game_selected.get_category() == category]
        if len(filtered_games) == 1:
            for index in range(len(self._probabilities)):
                if self._probabilities[index].split(":")[0] == category:
                    prob_amt = int(self._probabilities[index].split(":")[1])
                    self._total_probability -= prob_amt
                    del self._probabilities[index]
                    break
        self._selected_rh_games.remove(game)
    
    # call this function to generate the next game
    # will return the name of the game
    def generate_game(self, potential_players: list, skip_game: Minigame) -> Minigame:
        print('generating games with all players')
        print([players.get_name() for players in potential_players])
        game_name = self.get_game()

        # if multiplayer enabled and only one player left in round, generate single player game
        while skip_game != None and skip_game.__eq__(game_name) and (len(potential_players) < 2 if game_name.get_multiplayer() else 1):
            game_name = self.get_game()

        return game_name

    def convert_game_identifier_to_game(self, game_identifier: str):
        if game_identifier == None or game_identifier == '':
            return None
        for game in self._selected_rh_games:
            if game.equal_identifier() == game_identifier:
                return game
        return None
    
    def generate_data_for_turn(self, skipped_game_identifier):
        skipped_game = self.convert_game_identifier_to_game(skipped_game_identifier)
        self.get_players_for_turn(skipped_game != None)
        game = self.generate_game(self._player_list, skipped_game)
        if game.get_multiplayer():
            self.remove_player_from_pool()
        elif len(self._chosen_players_for_turn) == 2:
            del self._chosen_players_for_turn[1]
        print('chosen player before returning to main game logic')
        print(self._chosen_players_for_turn)
        return [game, self._chosen_players_for_turn]
    
    def determine_point_value_and_add_to_data(self, game, value):
        final_value = value
        if game.get_category() in self._scoring.keys():
            if value == 'Try Again':
                final_value = 0
            elif value == 'OK':
                final_value = float(self._scoring[game.get_category()].split(":")[0])
            elif value == 'Superb':
                final_value = float(self._scoring[game.get_category()].split(":")[1])
            else:
                print('your logic sucks')
        
        else:
            # prob in endless mode
            final_value = int(value) * float(self._scoring[game.get_name() + ':endless'].split(":")[0])
            final_value = round(final_value)
        
        self.add_points_to_player(int(final_value))
        print('clear temp player cuz game deleted')
        self._temp_removed_player.clear()
        self.delete_game(game)
    
    def add_points_to_player(self, point_rating):
        for chosen_players in self._chosen_players_for_turn:
            for all_players in self._player_list:
                if (chosen_players == all_players):
                    all_players.add_points(point_rating)
    
    def get_scoring(self):
        return self._scoring
        

    

