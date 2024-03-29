export const typeDefs = `#graphql
  type Forecast {
    forecastday: [ForecastDay]
  }
  
  type ForecastDay {
    date: String
    date_epoch: Int
    day: ForecastDayDetails
    astro: ForecastAstroDetails
    hour: [HourlyWeather]
  }
  
  type ForecastDayDetails {
    maxtemp_c: Float
    maxtemp_f: Float
    mintemp_c: Float
    mintemp_f: Float
    avgtemp_c: Float
    avgtemp_f: Float
    maxwind_mph: Float
    maxwind_kph: Float
    totalprecip_mm: Float
    totalprecip_in: Float
    avgvis_km: Float
    avgvis_miles: Float
    avghumidity: Int
    daily_will_it_rain: Int
    daily_chance_of_rain: String
    daily_will_it_snow: Int
    daily_chance_of_snow: String
    condition: WeatherCondition
  }
  
  type ForecastAstroDetails {
    sunrise: String
    sunset: String
    moonrise: String
    moonset: String
  }
  
  type HourlyWeather {
    time_epoch: Int
    time: String
    temp_c: Float
    temp_f: Float
    is_day: Int
    condition: WeatherCondition
    wind_mph: Float
    wind_kph: Float
    wind_degree: Int
    wind_dir: String
    pressure_mb: Float
    pressure_in: Float
    precip_mm: Float
    precip_in: Float
    snow_cm: Float
    humidity: Int
    cloud: Int
    feelslike_c: Float
    feelslike_f: Float
    windchill_c: Float
    windchill_f: Float
    heatindex_c: Float
    heatindex_f: Float
    dewpoint_c: Float
    dewpoint_f: Float
    will_it_rain: Int
    chance_of_rain: Int
    will_it_snow: Int
    chance_of_snow: Int
    vis_km: Float
    vis_miles: Float
    gust_mph: Float
    gust_kph: Float
    uv: Float
    short_rad: Float
    diff_rad: Float
  }
  
  type Weather {
    location: Location
    current: CurrentWeather
    forecast: Forecast
  }
  
  type Location {
    name: String
    region: String
    country: String
    lat: Float
    lon: Float
    tz_id: String
    localtime_epoch: Int
    localtime: String
  }
  
  type CurrentWeather {
    last_updated_epoch: Int
    last_updated: String
    temp_c: Float
    temp_f: Float
    is_day: Int
    wind_mph: Float
    wind_kph: Float
    wind_degree: Int
    wind_dir: String
    pressure_mb: Float
    pressure_in: Float
    precip_mm: Float
    precip_in: Float
    humidity: Int
    cloud: Int
    feelslike_c: Float
    feelslike_f: Float
    vis_km: Float
    vis_miles: Float
    uv: Int
    gust_mph: Float
    gust_kph: Float
  }
  
  type WeatherCondition {
    text: String
    icon: String
    code: Int
  }
  
  type Query {
    weather: Weather
  }  
  type User {
    id: ID!
    username: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Mutation {
    signup(username: String!, password: String!): AuthPayload
    login(username: String!, password: String!): AuthPayload
  }

  type Subscription {
    userAdded: User
  }
`;
