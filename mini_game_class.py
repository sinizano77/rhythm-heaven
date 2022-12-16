class Minigame:
    def __init__(self, id: int, game_name: str, category : str, multiplayer: bool, point_meter: bool, platform: str, title_card_url: str, color: str, sequel_remix : bool, required_games: list):
        self._id = id
        self._game_name = game_name
        self._category = category
        self._multiplayer = multiplayer
        self._point_meter = point_meter
        self._platform = platform
        self._sequel_remix = sequel_remix
        self._required_games = required_games
        self._title_card_url = title_card_url
        self._color = color

    def get_id(self) -> int:
        return self._id
        
    def get_game_name(self) -> str:
        return self._game_name

    def get_category(self) -> str:
        return self._category
    
    def get_multiplayer(self) -> bool:
        return self._multiplayer
    
    def get_point_meter(self) -> bool:
        return self._point_meter
    
    def get_platform(self) -> str:
        return self._platform

    def get_title_card_url(self) -> str:
        return self._title_card_url
    
    def get_color(self) -> str:
        return self._color
    
    def get_sequel_remix(self) -> bool:
        return self._sequel_remix
    
    def get_required_games(self) -> list:
        return self._required_games
    
    def equal_identifier(self) -> str:
        return self._game_name + ":" + self._category + ":" + self._platform
    
    def __eq__(self, obj):
         return isinstance(obj, Minigame) and obj.equal_identifier() == self.equal_identifier()
    


