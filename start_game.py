import random
from game_session_class import GameSession
from game_session_class import Round
from player_class import Player

def main():
    #runs everything
    get_starting_info()

def ask_player_amt() -> int:
    #asks how many players in the game
    return int(input('How many players?: '))

def ask_player_names(player_amt: int) -> list[Player]:
    #gets all the player names
    player_list = []
    for i in range(player_amt):
        player_name = input(f'What is the name of player {i}?: ')
        player_handicap = ask_handicap(player_name)
        player_handicap = _check_handicap(player_handicap)
        player_list.append(Player(player_name, player_handicap))
    return player_list


def _check_handicap(player_handicap: str) -> str:
    #checks if handicap response is 'yes' or 'no'
    while player_handicap != 'yes' and player_handicap != 'no':
        player_handicap = input('Response is not valid, please try again. Yes or No: ').lower()
    return player_handicap

def ask_handicap(player_name: str) -> bool:
    #asks which players get a handicap
    return input("Will {player_name} receieve a .75x point handicap? Yes or No: ")

def ask_rh_games():
    #asks which generation rh games will be in the pool
    print('Which rh games do you want? Tengoku, Ds, Fever, Megamix')

def get_starting_info() -> GameSession:
    #gets initial info to start the game with
    player_amt = ask_player_amt()
    player_list = ask_player_names(player_amt)



if __name__ == "__main__":
    #main()
    check_handicap(None)