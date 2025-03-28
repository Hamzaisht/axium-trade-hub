
// Fix the line that accesses sentimentData, change from:
// const { sentimentData, sentimentLoading, sentimentError } = useSentimentAnalysis({ creatorId: id });
// to:
const sentimentAnalysis = useSentimentAnalysis({ creatorId: id });
const sentimentData = sentimentAnalysis.data;
const sentimentLoading = sentimentAnalysis.isLoading;
const sentimentError = sentimentAnalysis.error;
