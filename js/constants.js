const elementClass = Object.freeze({
    YOUTUBE_VIDEO_PLAYER: "video-stream",
    UDEMY_VIDEO_PLAYER_PREFIX: "video-player--video-player--"
});


const ViewUrl = Object.freeze({
    YOUTUBE: "https://www.youtube.com",
    UDEMY: "https://www.udemy.com/course"
});


const AnalyticsEventId = Object.freeze({
    LOAD: 1,    
    BTN_CLICKED: 2,
    
});

const AnalyticsBtnId = Object.freeze({
    YT_LOAD: 1,
    UDEMY_LOAD: 2,
    YT_CAPTURE: 3,
    UDEMY_CAPTURE: 4,
    SHOW_CAPTURES: 5,
    DELETE_ALL: 6,
    EXPORT: 7
});

const GA_ENDPOINT = "https://www.google-analytics.com/mp/collect";
const MEASUREMENT_ID = "G-3HGD0WGK2F";
const API_SECRET = "TT550J5MSC-paLmRhKeK_A";


const CaptureBtnFunction = Object.freeze({
    SCREENSHOT: 1, 
    EXPORT: 2
});