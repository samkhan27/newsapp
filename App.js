import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
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
  const [loading, isLoading] = useState(true)
  useEffect(() => {
    fetchNews(debouncedSearchQuery)
    .then(data => setNews(data))
  }, [debouncedSearchQuery])

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search"
        onChangeText={query => setSearchQuery(query)}
        value={searchQuery}
        style={styles.searchBar}
      />
      <FlatList
        data={news?.articles || []}
        renderItem={({item}) => {
          return (
            <View  style={styles.newsItem}>
              <Card>
                <Card.Title title={item.title} subtitle={item.description}/>
                <Card.Content>
                  <Text variant="titleLarge">{item.content}</Text>
                </Card.Content>
                <Card.Cover source={{ uri: item.urlToImage }} />
              </Card>
            </View>
          )
        }}
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
  }
});
