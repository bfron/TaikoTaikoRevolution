#pragma strict

// 곡 정보 표시
var songTitle : Transform;
var songDiff : Transform;

// 스코어 표시
var totalScore : Transform;

// 판정 표시
var coolCount : Transform;
var greatCount : Transform;
var goodCount : Transform;
var badCount : Transform;
var missCount : Transform;
var maxCombo : Transform;

// 게이지 표시
var gauge : Transform;
var gaugeColor : Transform;
var clearPercent : Transform;
var stageClearMessage : Transform;

var audioDong : AudioClip;


var resultEnd : boolean;

function Start () {
	// 각종 초기화
	resultEnd = false;
	coolCount.GetComponent(TextMesh).text = "";
	goodCount.GetComponent(TextMesh).text = "";
	greatCount.GetComponent(TextMesh).text = "";
	badCount.GetComponent(TextMesh).text = "";
	missCount.GetComponent(TextMesh).text = "";
	maxCombo.GetComponent(TextMesh).text = "";
	clearPercent.GetComponent(TextMesh).text = "";
	stageClearMessage.GetComponent(TextMesh).text = "";
	gauge.localScale.x = 0;
	
	songTitle.GetComponent(TextMesh).text = jsMakeNote.title;
	songDiff.GetComponent(TextMesh).text = jsMakeNote.difficulty;
	ScoreCount();
}

function Update () {

	if(resultEnd == true) {
		if(Input.GetKeyDown(KeyCode.Escape))
			Application.LoadLevel(1);
	}

}

function JudgeCount() {
	
	AudioSource.PlayClipAtPoint(audioDong, Vector3.zero);	
	coolCount.GetComponent(TextMesh).text = jsJudge.coolCount+"";
	yield WaitForSeconds(0.5);
	AudioSource.PlayClipAtPoint(audioDong, Vector3.zero);
	greatCount.GetComponent(TextMesh).text = jsJudge.greatCount+"";
	yield WaitForSeconds(0.5);
	AudioSource.PlayClipAtPoint(audioDong, Vector3.zero);
	goodCount.GetComponent(TextMesh).text = jsJudge.goodCount+"";
	yield WaitForSeconds(0.5);
	AudioSource.PlayClipAtPoint(audioDong, Vector3.zero);
	badCount.GetComponent(TextMesh).text = jsJudge.badCount+"";
	yield WaitForSeconds(0.5);
	AudioSource.PlayClipAtPoint(audioDong, Vector3.zero);
	missCount.GetComponent(TextMesh).text = jsJudge.missCount+"";
	yield WaitForSeconds(0.5);
	AudioSource.PlayClipAtPoint(audioDong, Vector3.zero);
	maxCombo.GetComponent(TextMesh).text = jsJudge.maxCombo+"";
	yield WaitForSeconds(0.5);
	
	Gauge();
}

function ScoreCount() {
	yield WaitForSeconds(0.5);
	AudioSource.PlayClipAtPoint(audioDong, Vector3.zero);
	totalScore.GetComponent(TextMesh).text = jsJudge.totalScore+"";
	yield WaitForSeconds(0.5);
	JudgeCount();
}

function Gauge() {
	var clearGauge : float = jsJudge.clearGauge;
	
	for(var i=0.0;i<clearGauge;i+=0.5) {
		if(i>=80)
			gaugeColor.renderer.material = Resources.Load("Materials/ClearOk");
	
		gauge.localScale.x =  8.5*(i / 100);
		yield WaitForSeconds(0.01);
	}
	gauge.localScale.x =  8.5*(clearGauge / 100);
	AudioSource.PlayClipAtPoint(audioDong, Vector3.zero);
	clearPercent.GetComponent(TextMesh).text = clearGauge+"%";
	
	if(clearGauge >= 80)
		stageClearMessage.GetComponent(TextMesh).text = "STAGE CLEAR!";
	else
		stageClearMessage.GetComponent(TextMesh).text = "STAGE FAILED";
		
	resultEnd = true;

}