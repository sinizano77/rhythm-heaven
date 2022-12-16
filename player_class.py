class Player:
    def __init__(self, id: int, name : str, pfp: str, handicap : bool):
        self._id = id
        self._name = name
        self._pfp = pfp
        self._handicap = handicap
        self._points = 0.00
    
    def __eq__(self, obj):
        return isinstance(obj, Player) and obj.get_id() == self._id

    def get_points(self) -> float:
        return self._points

    def add_points(self, points : float) -> None:
        final_points = points
        if (self._handicap):
            final_points *= 0.75
            final_points = round(final_points)
        self._points += final_points
    
    def get_pfp(self) -> str:
        return self._pfp
    
    def get_handicap(self) -> bool:
        return self._handicap
    
    def get_name(self) -> str:
        return self._name
    
    def get_id(self) -> int:
        return self._id
    


