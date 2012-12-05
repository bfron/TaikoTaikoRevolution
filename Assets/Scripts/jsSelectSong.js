#pragma strict

enum DIFF { NM, HD, ONI };
enum DIR { UP, DOWN, NONE };

var selectPanel : Transform;
var selectedTitle : GameObject;
var selectedDifficulty : GameObject;
var selectedBpm : GameObject;
var selectedLevel : GameObject; // 현재 선택되어 있는 곡 정보 표시를 위한 3D Text

var upTitle : GameObject; // 현재 선택된 곡 위에 있는 곡 정보 표시
var downTitle : GameObject; // 현재 선택된 곡 아래에 있는 곡 정보 표시

static var selectNum : int; // 현재 골라져 있는 곡 번호
private var upNum : int; // 위에 있는 곡 번호
private var downNum : int; // 아래에 있는 곡 번호

static var selectDiff : DIFF; // 선택되어 있는 난이도

static var firstStart : boolean;

function Start () {
	if(firstStart == true) { // 첫번째로 실행되는 경우
		selectNum = 0;
		
		if(jsReadSong.musiclist.length == 1) { // 불러온 노래가 한곡 밖에 없을 경우
			upNum = 0;
			downNum = 0;
		} else {
			upNum = jsReadSong.musiclist.length - 1; // 맨 처음에는 위의 곡은 마지막 곡이 나오게 된다.
			downNum = 1;
		}
	}
	else {
		if(selectNum == 0) { // 한번 플레이를 한 이후에 실행되는 경우, 기존에 선택했던 곡이 선택되어있게 한다
			if(jsReadSong.musiclist.length == 1) { // 불러온 노래가 한곡 밖에 없을 경우
				upNum = 0;
				downNum = 0;
			}
			else {
				upNum = jsReadSong.musiclist.length - 1;
				downNum = selectNum + 1;
			}
		}
		else {
			if((selectNum+1) == jsReadSong.musiclist.length) {
				upNum = selectNum - 1;
				downNum = 0;
			} else if((selectNum - 1) < 0) {
				upNum = jsReadSong.musiclist.length - 1;
				downNum = selectNum+1;;
			} else {
				upNum = selectNum - 1;
				downNum = selectNum + 1;
			}
		}
	
	}
	
	print("upNum : " + upNum + ", doNum : " + downNum);
		
	selectDiff = DIFF.NM; // 처음 곡을 골랐을 때는 노멀 난이도 부터 나온다
	SelectDiffSong(DIR.NONE); // 해당 난이도가 있는지 검사를 한다.
	SelectSong(); // 선택된 곡 정보 표시
	OtherSong(); // 위 아래 곡 정보 표시
	
	firstStart=false;
}

function Update () {
	if(Input.GetButtonDown("Down")) { // 화살표 아래 키를 눌렀을 때
		upNum = selectNum; // 현재 선택되어 있던 곡이 위에 표시되게 된다.
		selectNum = downNum; // 아래에 표시되어 있던 곡이 선택된다.
		if((selectNum + 1) == jsReadSong.musiclist.length) // 선택된 곡이 배열의 마지막 곡일 경우
			downNum = 0; // 아래에는 첫번째 곡이 표시된다.
		else
			downNum = selectNum + 1; // 보통의 경우에는 선택된 곡의 다음곡이 아래에 표시 된다.
		
		selectDiff = DIFF.NM;
		SelectDiffSong(DIR.NONE);	
		SelectSong();
		OtherSong();
	}
	if(Input.GetButtonDown("Up")) {
		downNum = selectNum;
		selectNum = upNum;
		if((selectNum - 1) < 0)
			upNum = jsReadSong.musiclist.length - 1;
		else
			upNum = selectNum - 1;
			
		selectDiff = DIFF.NM;
		SelectDiffSong(DIR.NONE);			
		SelectSong();
		OtherSong();
	}
	if(Input.GetButtonDown("Right")) { // 화살표 오른쪽 키를 눌렀을 때(고난이도 선택)
		SelectDiffSong(DIR.UP); // 고난이도가 있는지 확인
		SelectSong(); // 표시
	}
	if(Input.GetButtonDown("Left")) { // 화살표 왼쪽 키를 눌렀을 때(저난이도 선택)
		SelectDiffSong(DIR.DOWN); // 저난이도가 있는지 확인
		SelectSong(); // 표시
	}
	
	if(Input.GetKeyDown(KeyCode.Return)) {
		Application.LoadLevel(2);
	}
	if(Input.GetKeyDown(KeyCode.F5)) {
		Application.LoadLevel(0);
	}
}

function SelectDiffSong(diffDir : DIR) {
	if(diffDir == DIR.NONE) {
		if(jsReadSong.musiclist[selectNum].normal != null)
			selectDiff = DIFF.NM;
		else if(jsReadSong.musiclist[selectNum].hard != null)
			selectDiff = DIFF.HD;
		else
			selectDiff = DIFF.ONI;
	} else {
		if(diffDir == DIR.UP) {
			if(selectDiff == DIFF.NM) {
				if(jsReadSong.musiclist[selectNum].hard != null)
					selectDiff = DIFF.HD;
				else if(jsReadSong.musiclist[selectNum].oni != null)
					selectDiff = DIFF.ONI;
			} else if(selectDiff == DIFF.HD) {
				if(jsReadSong.musiclist[selectNum].oni != null)
					selectDiff = DIFF.ONI;
			}
		} else if(diffDir == DIR.DOWN) {
			if(selectDiff == DIFF.ONI) {
				if(jsReadSong.musiclist[selectNum].hard != null)
					selectDiff = DIFF.HD;
				else if(jsReadSong.musiclist[selectNum].normal != null)
					selectDiff = DIFF.NM;
			} else if(selectDiff == DIFF.HD) {
				if(jsReadSong.musiclist[selectNum].normal != null)
					selectDiff = DIFF.NM;
			}
		}
	}

}
function OtherSong() {
	if(jsReadSong.musiclist[upNum].normal != null)										// 노멀이 있으면 
		upTitle.GetComponent(TextMesh).text = jsReadSong.musiclist[upNum].normal.title; // 노멀 타이틀 표시
	else if(jsReadSong.musiclist[upNum].hard != null) 									// 노멀이 없고 하드만 있으면 
		upTitle.GetComponent(TextMesh).text = jsReadSong.musiclist[upNum].hard.title; 	// 하드 타이틀 표시
	else
		upTitle.GetComponent(TextMesh).text = jsReadSong.musiclist[upNum].oni.title;
		
	if(jsReadSong.musiclist[downNum].normal != null)
		downTitle.GetComponent(TextMesh).text = jsReadSong.musiclist[downNum].normal.title;
	else if(jsReadSong.musiclist[downNum].hard != null)
		downTitle.GetComponent(TextMesh).text = jsReadSong.musiclist[downNum].hard.title;
	else 
		downTitle.GetComponent(TextMesh).text = jsReadSong.musiclist[downNum].oni.title;
}
function SelectSong() {
	var i : int;
	selectedLevel.GetComponent(TextMesh).text = "★";

	if(selectDiff == DIFF.NM)	{
		selectPanel.gameObject.renderer.material.mainTexture = Resources.Load("NormalSelect");
		selectedTitle.GetComponent(TextMesh).text = jsReadSong.musiclist[selectNum].normal.title;
		selectedDifficulty.GetComponent(TextMesh).text = "Normal";
		selectedBpm.GetComponent(TextMesh).text = jsReadSong.musiclist[selectNum].normal.bpm + "bpm";
		print("selectNum : " + selectNum + " Title : " + jsReadSong.musiclist[selectNum].normal.title + " TotalNote :  " + jsReadSong.musiclist[selectNum].normal.totalnote);
		for(i=1;i<jsReadSong.musiclist[selectNum].normal.level;i++)
			selectedLevel.GetComponent(TextMesh).text += "★";
			
	} else if(selectDiff == DIFF.HD)	{
		selectPanel.gameObject.renderer.material.mainTexture = Resources.Load("HardSelect");
		selectedTitle.GetComponent(TextMesh).text = jsReadSong.musiclist[selectNum].hard.title;
		selectedDifficulty.GetComponent(TextMesh).text = "Hard";
		selectedBpm.GetComponent(TextMesh).text = jsReadSong.musiclist[selectNum].hard.bpm + "bpm";
		print("selectNum : " + selectNum + " Title : " + jsReadSong.musiclist[selectNum].hard.title + " TotalNote :  " + jsReadSong.musiclist[selectNum].hard.totalnote);
		for(i=1;i<jsReadSong.musiclist[selectNum].hard.level;i++)
			selectedLevel.GetComponent(TextMesh).text += "★";
	} else if(selectDiff == DIFF.ONI)	{
		selectPanel.gameObject.renderer.material.mainTexture = Resources.Load("OniSelect");
		selectedTitle.GetComponent(TextMesh).text = jsReadSong.musiclist[selectNum].oni.title;
		selectedDifficulty.GetComponent(TextMesh).text = "Oni";
		selectedBpm.GetComponent(TextMesh).text = jsReadSong.musiclist[selectNum].oni.bpm + "bpm";
		print("selectNum : " + selectNum + " Title : " + jsReadSong.musiclist[selectNum].oni.title + " TotalNote :  " + jsReadSong.musiclist[selectNum].oni.totalnote);
		for(i=1;i<jsReadSong.musiclist[selectNum].oni.level;i++)
			selectedLevel.GetComponent(TextMesh).text += "★";
	}
		
		
}