# some exploratory analysis of tweet data
# Ted Natoli

library("ggplot2")

# load data
tweets <- read.csv("tweets.csv", header=T)

# fix headers
names(tweets) <- gsub("..STRING.", "", names(tweets))
names(tweets) <- gsub("X.", "", names(tweets))

# barplot of swear usage
usage_tbl <- as.data.frame.table(table(tweets$search_term))
names(usage_tbl)[1] <- "search_term"
usage_tbl <- usage_tbl[order(usage_tbl$Freq, decreasing=T), ]
png(file="~/github/viz_project/plots/usage_barplot.png", height=1200, width=1200, units="px")
barplot(usage_tbl$Freq, names.arg=usage_tbl$search_term, las=3, col="firebrick", ylab="Number of Tweets", main="Profane & Violent Language on Twitter")
dev.off()

# add leading zeros to hour
tweets$hour <- unlist(lapply(tweets$hour, function(x) {
  if (nchar(x) == 1) {
    x <- paste("0", x, sep="")
  }
  return(x)
}))

# barplot of vulgar tweets by time periods
tweets$full_date <- paste(tweets$year, tweets$month, tweets$day, sep="-")
tweets$full_date_hour <- paste(tweets$full_date, tweets$hour)

png(file="~/github/viz_project/plots/vulgar_tweets_by_date.png", height=1200, width=1200, units="px")
barplot(table(tweets$full_date), las=3, main="Profane & Violent Tweets by Date", ylab="Number of Tweets", col="firebrick")
dev.off()

png(file="~/github/viz_project/plots/vulgar_tweets_by_date_hour.png", height=1200, width=3600, units="px")
barplot(table(tweets$full_date_hour), las=3, main="Profane & Violent Tweets by Day, Hour", ylab="Number of Tweets", col="firebrick")
dev.off()

png(file="~/github/viz_project/plots/vulgar_tweets_by_hour.png", height=1200, width=1200, units="px")
barplot(table(tweets$hour), las=3, main="Profane & Violent Tweets by Hour", ylab="Number of Tweets", col="firebrick")
dev.off()