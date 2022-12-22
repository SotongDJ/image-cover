const playerDOM = document.getElementById("player");

function updatePositionState() {
if (navigator.mediaSession.metadata) {
navigator.mediaSession.setPositionState({
duration:playerDOM.duration,
playbackRate:playerDOM.playbackRate,
position:playerDOM.currentTime
});
};
};    
function doUpdate(){
document.getElementById("preview").src = document.getElementById("base").value;
};
function afterPlay() {
doUpdate();
navigator.mediaSession.playbackState = 'playing';
navigator.mediaSession.metadata = new MediaMetadata({
title:document.getElementById("title").value,
artist:document.getElementById("artist").value,
album:document.getElementById("album").value,
artwork:[
{
src:document.getElementById("base").value,
sizes:document.getElementById("img_size").value,
type:document.getElementById("img_type").value
},
]
});
};
function afterPause() {
navigator.mediaSession.playbackState = 'paused';
};
playerDOM.addEventListener('play',afterPlay,false);
playerDOM.addEventListener('pause',afterPause,false);
playerDOM.addEventListener('ended',doNext,false);
playerDOM.addEventListener('timeupdate',function() {updatePositionState();});
async function mixPlay() {
var playPromise = playerDOM.play();
if (playPromise !== undefined) {
playPromise.then(_ => {
for (const [action,handler] of actionHandlers) {
try {
navigator.mediaSession.setActionHandler(action,handler);
} catch (error) {
console.log(`The media session action "${action}" is not supported yet.`);
};
};
}).catch(error => {
mixPause();
setTimeout(() => {
console.error(error);
mixPlay();
},"2000")
});
};
};
async function mixPause() {
playerDOM.pause();
};
async function doPrev() {
playerDOM.currentTime=0;
playerDOM.play();
};
async function doNext() {
playerDOM.currentTime=0;
playerDOM.play();
};
function seakBack(details) {
playerDOM.currentTime = Math.max(playerDOM.currentTime-10,0);
};
function seakForw(details) {
playerDOM.currentTime = Math.min(playerDOM.currentTime+10,playerDOM.duration);
};
function seakGoTo(details) {playerDOM.currentTime = details.seekTime;};
const actionHandlers = [
['play' ,async () => {mixPlay();}],
['pause' ,() => {mixPause(); }],
['previoustrack',async () => {doPrev(); }],
['nexttrack' ,async () => {doNext(); }],
['stop' ,null ],
['seekbackward' ,(details) => {seakBack(details); }],
['seekforward' ,(details) => {seakForw(details); }],
['seekto' ,(details) => {seakGoTo(details); }],
];
