# some exploratory analysis of tweet data
# Ted Natoli

library("ggplot2")
library("reshape")
library("rjson")

# load data
tweets <- read.csv("~/github/viz_project/website/data/tweets.csv", header=T, stringsAsFactors=F)

# fix headers
names(tweets) <- gsub("..STRING.", "", names(tweets))
names(tweets) <- gsub("X.", "", names(tweets))

# add leading zeros to hour
tweets$hour <- unlist(lapply(tweets$hour, function(x) {
  if (nchar(x) == 1) {
    x <- paste("0", x, sep="")
  }
  return(x)
}))

tweets$month <- unlist(lapply(tweets$month, function(x) {
  if (nchar(x) == 1) {
    x <- paste("0", x, sep="")
  }
  return(x)
}))

tweets$day <- unlist(lapply(tweets$day, function(x) {
  if (nchar(x) == 1) {
    x <- paste("0", x, sep="")
  }
  return(x)
}))

# control terms
control_terms <- c("tweet", "twitter")


# additional date fields
tweets$full_date <- paste(tweets$year, tweets$month, tweets$day, sep="-")
tweets$full_date_hour <- paste(tweets$full_date, tweets$hour)

# filter out any wierd data (bad dates)
tweets <- tweets[grep("2013", tweets$full_date), ]

# raw tweet frequency
tbl <- as.data.frame.table(table(tweets$full_date))
names(tbl) <- c("date", "num_tweets")
write.table(tbl, file="~/github/viz_project/website/data/raw_tweets_per_day.csv", col.names=T, row.names=F, sep=",", quote=F, eol="\n")

# normalized tweet frequency
avg_tbl <- as.data.frame.table(table(tweets$full_date) / length(setdiff(unique(tweets$search_term), control_terms)))
names(avg_tbl) <- c("date", "avg_vulgar_tweets")
control_tbl <- as.data.frame.table(table(tweets[tweets$search_term=="tweet" | tweets$search_term=="twitter", ]$full_date) / length(control_terms))
names(control_tbl) <- c("date", "avg_control_tweets")
norm_tbl <- merge(avg_tbl, control_tbl, by="date")
norm_tbl$norm_tweets <- norm_tbl$avg_vulgar_tweets / norm_tbl$avg_control_tweets
write.table(norm_tbl, file="~/github/viz_project/website/data/norm_tweets_per_day.csv", col.names=T, row.names=F, sep=",", quote=F, eol="\n")



tweet_tbl <- table(tweets$full_date, tweets$search_term)
tweet_tbl_norm <- tweet_tbl[tweet_tbl[, "tweet"] > 0 & tweet_tbl[, "twitter"] > 0, ]
norm_tweet_means <- apply(tweet_tbl_norm[, control_terms], 1, mean)
tweet_tbl_norm <- tweet_tbl_norm / norm_tweet_means
tweet_tbl_norm_out <- as.data.frame.table(tweet_tbl_norm)
names(tweet_tbl_norm_out) <- c("date", "search_term", "norm_count")
#write.table(tweet_tbl_norm_out, file="~/github/viz_project/website/data/norm_tweets_per_day.csv", col.names=T, row.names=F, sep=",", quote=F, eol="\n")


# tweet count per day by search term
tmp_tbl <- melt(table(tweets$full_date, tweets$search_term))
day_list <- list()
for (d in levels(as.factor(tmp_tbl$Var.1))) {
  tmp <- tmp_tbl[tmp_tbl$Var.1==d, c("Var.2", "value")]
  names(tmp) <- c("search_term", "count")
  tmp_list <- list("date"=d, "search_term"=tmp$search_term, "count"=tmp$count)
  day_list[[length(day_list) + 1]] <- tmp_list
}
cat(toJSON(day_list), file="~/github/viz_project/website/data/raw_tweet_distrib_by_day.json")


makePlots <- function() {
  # barplot of swear usage
  usage_tbl <- as.data.frame.table(table(tweets$search_term))
  names(usage_tbl)[1] <- "search_term"
  usage_tbl <- usage_tbl[order(usage_tbl$Freq, decreasing=T), ]
  png(file="~/github/viz_project/plots/usage_barplot.png", height=1200, width=1200, units="px")
  barplot(usage_tbl$Freq, names.arg=usage_tbl$search_term, las=3, col="firebrick", ylab="Number of Tweets", main="Profane & Violent Language on Twitter")
  dev.off()
  
  # barplot of vulgar tweets by time periods
  png(file="~/github/viz_project/plots/vulgar_tweets_by_date.png", height=1200, width=1200, units="px")
  barplot(table(tweets$full_date), las=3, main="Profane & Violent Tweets by Date", ylab="Number of Tweets", col="firebrick")
  dev.off()
  
  png(file="~/github/viz_project/plots/vulgar_tweets_by_date_hour.png", height=1200, width=3600, units="px")
  barplot(table(tweets$full_date_hour), las=3, main="Profane & Violent Tweets by Day, Hour", ylab="Number of Tweets", col="firebrick")
  dev.off()
  
  png(file="~/github/viz_project/plots/vulgar_tweets_by_hour.png", height=1200, width=1200, units="px")
  barplot(table(tweets$hour), las=3, main="Profane & Violent Tweets by Hour", ylab="Number of Tweets", col="firebrick")
  dev.off()
}