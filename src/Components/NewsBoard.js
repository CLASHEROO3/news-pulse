// Inside your articles.map in NewsBoard.js:
<NewsItem 
  key={index} 
  title={news.title} 
  description={news.description} 
  src={news.urlToImage} 
  url={news.url} 
  source={news.source.name} 
  publishedAt={news.publishedAt} // <--- ADD THIS LINE
/>