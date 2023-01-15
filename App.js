import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator } from 'react-native';
import { Searchbar, Card } from 'react-native-paper';

const API_KEY = '183daca270264bad86fc5b72972fb82a'

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay || 500)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}

const fetchNews = (topic) => {
  return fetch(`https://newsapi.org/v2/everything?q=${topic}&from=2023-01-15&sortBy=popularity&apiKey=${API_KEY}`)
  .then(res => res.json())
}

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 400)

  const [news, setNews] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    setIsError(false)
    
    fetchNews(debouncedSearchQuery)
    .then(data => {
      setNews(data)
      setIsLoading(false)
    })
    .catch((error) => {
      console.log(error)
      setIsError(true)
      setIsLoading(false)
      setNews([])
    })
  }, [debouncedSearchQuery])

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search"
        onChangeText={query => setSearchQuery(query)}
        value={searchQuery}
        style={styles.searchBar}
      />
      {isLoading && <ActivityIndicator/>}
      {isError && <Text>Something went wrong. Please try again.</Text>}
      <FlatList
        data={news?.articles || []}
        renderItem={({item}) => {
          return (
            <Card style={styles.newsItem} mode='outlined'>
              <Card.Title title={item.title} subtitle={item.description}/>
              <Card.Content>
                <Text variant="titleLarge">{item.content}</Text>
                <Text variant="bodyMedium">source: {item.source.name}</Text>
                <Text variant="bodyMedium">author: {item.author}</Text>
              </Card.Content>
              <Card.Cover style={styles.cardImage} source={{ uri: item.urlToImage }} />
            </Card>
          )
        }
      }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 5,
    paddingTop: 25,
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  newsItem: {
    marginVertical: 5
  },
  searchBar: {
    marginBottom: 10
  },
  cardImage: {
    marginTop: 5,
  }
});
