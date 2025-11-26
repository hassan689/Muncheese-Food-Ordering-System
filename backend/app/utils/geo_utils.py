import math

def calculate_distance(lat1, lon1, lat2, lon2):
    """
    Calculate the great circle distance between two points 
    on the earth (specified in decimal degrees) using Haversine formula.
    """
    # Radius of earth in kilometers. Use 3956 for miles
    R = 6371.0 
    
    # Convert latitude and longitude from degrees to radians
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    
    # Haversine formula
    a = math.sin(dlat / 2)**2 + \
        math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * \
        math.sin(dlon / 2)**2
        
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    
    distance = R * c
    
    return distance # Returns value in Kilometers