#pragma strict

/* 노트를 불러오고, 생성하는 소스 */
import System.IO; 
enum TYPE { S_DONG, B_DONG, S_KAT, B_KAT, S_LONG_S, S_LONG_M, S_LONG_E, B_LONG_S, B_LONG_M, B_LONG_E, NONE };

var Dong_Small : Transform;
var Dong_Big : Transform;
var Kat_Small : Transform;
var Kat_Big : Transform;
var SmallLong_Start : Transform;
var SmallLong_Mid : Transform;
var SmallLong_End : Transform;
var BigLong_Start : Transform;
var BigLong_Mid : Transform;
var BigLong_End : Transform; // 노트들을 읽어옵시다

var startLine : Transform; // 마디의 시작부에 나오는 라인
var songTitle : Transform; // 노래 제목 표시

var timingFake : Transform;

//var testmes : GUIText;

private var diff : DIFF;
var songNum : int;

var songPath;
var notePath;

static var title : String; // 곡 제목
static var difficulty : String;

static var inputBpm : float;
static var maketime : float;
var startTime : float;

var noteFile : StreamReader;

static var moveNote : boolean; // 노트를 움직일까요?

private var musicStart : boolean;

static var totalNote : int; // 전체 노트


// 곡 로드
var testString;
private var readmusic : WWW;

var waitTime : float; // 노트와 노래의 싱크를 맞추기 위해 노트, 또는 노래가 대기해야 하는 시간.

function Start () {
	var temp;
	moveNote = false;
	musicStart = false;
	
	diff = jsSelectSong.selectDiff;
	songNum = jsSelectSong.selectNum;
	
	if(diff == DIFF.NM) {
		difficulty = "Normal";
		notePath = jsReadSong.musiclist[songNum].path +"/Normal.tgs";
		print("난이도 : 노멀, Path : " + notePath + " num : " + songNum);
		inputBpm = jsReadSong.musiclist[songNum].normal.bpm;
		startTime = jsReadSong.musiclist[songNum].normal.starttime;
		totalNote = jsReadSong.musiclist[songNum].normal.totalnote;
		title = jsReadSong.musiclist[songNum].normal.title;
		songTitle.GetComponent(TextMesh).text = title;
	}	else if(diff == DIFF.HD) {
		difficulty = "Hard";
		notePath = jsReadSong.musiclist[songNum].path +"/Hard.tgs";
		print("난이도 : 하드, Path : " + notePath + " num : " + songNum);
		inputBpm = jsReadSong.musiclist[songNum].hard.bpm;
		startTime = jsReadSong.musiclist[songNum].hard.starttime;
		totalNote = jsReadSong.musiclist[songNum].hard.totalnote;
		title = jsReadSong.musiclist[songNum].hard.title;
		songTitle.GetComponent(TextMesh).text = title;
	}	else if(diff == DIFF.ONI) {
		difficulty = "Oni";
		notePath = jsReadSong.musiclist[songNum].path +"/Oni.tgs";
		print("난이도 : 오니, Path : " + notePath + " num : " + songNum);
		inputBpm = jsReadSong.musiclist[songNum].oni.bpm;
		startTime = jsReadSong.musiclist[songNum].oni.starttime;
		totalNote = jsReadSong.musiclist[songNum].oni.totalnote;
		title = jsReadSong.musiclist[songNum].oni.title;
		songTitle.GetComponent(TextMesh).text = title;
	}
	
	maketime = (60 / inputBpm) * 4;
	print("maketime : " + maketime);
	
	noteFile = new File.OpenText(notePath);
	
	while(true) {
		temp = noteFile.ReadLine();
		if(temp == ':MAIN') break;
	}
	
	//var waitTime : float = startTime-(maketime*3);
	waitTime = startTime - (((60 /inputBpm) * 4)*2);
	waitTime = Mathf.Round(waitTime*100) / 100;
		
	
	ReadNote();	
	BgmSet();
	
}
function BgmSet() {
	var temp : AudioClip;
	
	songPath = "file://"+jsReadSong.musiclist[songNum].path + "/Song.ogg";
	print(File.Exists(songPath) + " 파일 있니 없니? " + songPath);
	readmusic = new WWW(songPath);
	
	//print("Loading....");
//	testmes.text = "Loading....";
	yield readmusic;
//	testmes.text = "다운로드 Ok? : " + readmusic.isDone;
	
	print("다운로드 Ok? : " + readmusic.isDone);
	
	audio.clip = readmusic.GetAudioClip(false);
	
	BgmPlay();
	
}

function Update () {

	if(Input.GetKeyDown(KeyCode.Escape))
		Application.LoadLevel(3);
		
	if(musicStart == true && audio.isPlaying == false)
		Application.LoadLevel(3);
}
function BgmPlay() {

	if(waitTime > 0) {
		print(startTime + " 시작하고 기다립니다 " + waitTime);
		//testmes.text = startTime + " 시작하고 기다립니다 " + waitTime;
		audio.Play();
		yield WaitForSeconds(waitTime);
		moveNote = true;
		
	} else if(waitTime < 0) {
		waitTime = waitTime * -1;
		print(waitTime + "기다렸다 시작합니다 " + startTime);
		//testmes.text = waitTime + "기다렸다 시작합니다 " + startTime;
		moveNote = true;
		yield WaitForSeconds(waitTime);
		audio.Play();
	}
	else if(waitTime == 0) {
		//testmes.text = waitTime + " 바로 시작합니다 " + startTime;
		audio.Play();
		moveNote=true;
	}
	musicStart=true;
}
function ReadNote() {
	var inputline = "";
	var height : float = 0; // 노트의 높이 조절
	var timing : float;
	var finalNote : Transform;
			
	if(waitTime > 0 || waitTime == 0)
		timing = 21.25;
	else if(waitTime < 0)
		timing = 19.5;
	
	while(true) {
		inputline = noteFile.ReadLine(); // 한줄을 읽어 옵니다.
		
		if(inputline == null) break;
		
		for(var i=0;i<inputline.Length; i++){
			if(i+2 < inputline.Length) { // height 값을 초기화 하기 위해 사용
				if(inputline.Substring(i, 2) == '00')
					height=0;
				else if(inputline.Substring(i, 2) == '01')
					height=0;
				else if(inputline.Substring(i, 2) == '02')
					height=0;	
			}
			
			if(i==0) {
				if(finalNote != null) {
					timing = finalNote.position.x + 0.75; // 타이밍을 훼이크노트 + 0.75로 설정
					Destroy(finalNote.gameObject); // 훼이크노트를 파괴
				}
				
				Instantiate(startLine, Vector3(timing, (height-0.001)), Quaternion.identity);
			}
			
			if(inputline.Substring(i, 1) == '0') {
			}
			else if(inputline.Substring(i, 1) == '1') {
				Instantiate(Dong_Small, Vector3(timing, height), Quaternion.identity);
			}
			else if(inputline.Substring(i, 1) == '2') {
				Instantiate(Kat_Small, Vector3(timing, height), Quaternion.identity);
			}
			else if(inputline.Substring(i, 1) == '3') {
				Instantiate(Dong_Big, Vector3(timing, height), Quaternion.identity);
			}
			else if(inputline.Substring(i, 1) == '4') {
				Instantiate(Kat_Big, Vector3(timing, height), Quaternion.identity);
			}
			else if(inputline.Substring(i, 1) == 'A') {
				Instantiate(SmallLong_Start, Vector3(timing, height), Quaternion.identity);
			}
			else if(inputline.Substring(i, 1) == 'S') {
				Instantiate(SmallLong_Mid, Vector3(timing, height), Quaternion.identity);
			}
			else if(inputline.Substring(i, 1) == 'D') {
				Instantiate(SmallLong_End, Vector3(timing, height), Quaternion.identity);
			}
			else if(inputline.Substring(i, 1) == 'Z') {
				Instantiate(BigLong_Start, Vector3(timing, height), Quaternion.identity);
			}
			else if(inputline.Substring(i, 1) == 'X') {
				Instantiate(BigLong_Mid, Vector3(timing, height), Quaternion.identity);
			}
			else if(inputline.Substring(i, 1) == 'C') {
				Instantiate(BigLong_End, Vector3(timing, height), Quaternion.identity);
			}
			
			if(i == inputline.Length -1)
				finalNote = Instantiate(timingFake, Vector3(timing, height, -20), Quaternion.identity); // 싱크를 맞추기 위한 훼이크 노트
			
			timing += 0.75;
			height -= 0.001; // 노트가 붙어서 나올 경우, 먼저 나온 노트보다 뒤에 가도록 하기 위함
		}
		
		yield WaitForSeconds(maketime);
	}
	
}