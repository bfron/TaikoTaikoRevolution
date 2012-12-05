#pragma strict
 
var comboCount : Transform;
var closeCount : int;
var open = false;
var playFullCombo = false;

//소리
var combo50 : AudioClip;
var combo100 : AudioClip;
var combo200 : AudioClip;
var combo300 : AudioClip;
var combo400 : AudioClip;
var combo500 : AudioClip;
var combo600 : AudioClip;
var combo700 : AudioClip;
var combo800 : AudioClip;
var combo900 : AudioClip;
var comboFull : AudioClip;

function Start () {

}

function Update () {

	if(jsJudge.maxCombo % 10 == 0 && jsJudge.maxCombo > 0 && open == false)
	{
		comboCount.GetComponent(TextMesh).text = ""+jsJudge.maxCombo;
		MessageOpen();
		open = true;
		
		if(jsJudge.maxCombo == 50)
			AudioSource.PlayClipAtPoint(combo50, Vector3.zero);
		else if(jsJudge.maxCombo == 100)
			AudioSource.PlayClipAtPoint(combo100, Vector3.zero);
		else if(jsJudge.maxCombo == 200)
			AudioSource.PlayClipAtPoint(combo200, Vector3.zero);
		else if(jsJudge.maxCombo == 300)
			AudioSource.PlayClipAtPoint(combo300, Vector3.zero);
		else if(jsJudge.maxCombo == 400)
			AudioSource.PlayClipAtPoint(combo400, Vector3.zero);
		else if(jsJudge.maxCombo == 500)
			AudioSource.PlayClipAtPoint(combo500, Vector3.zero);
		else if(jsJudge.maxCombo == 600)
			AudioSource.PlayClipAtPoint(combo600, Vector3.zero);
		else if(jsJudge.maxCombo == 700)
			AudioSource.PlayClipAtPoint(combo700, Vector3.zero);
		else if(jsJudge.maxCombo == 800)
			AudioSource.PlayClipAtPoint(combo800, Vector3.zero);
		else if(jsJudge.maxCombo == 900)
			AudioSource.PlayClipAtPoint(combo900, Vector3.zero);
	}
	
	if(jsJudge.maxCombo == jsMakeNote.totalNote && playFullCombo == false) {
		playFullCombo = true;
		comboCount.GetComponent(TextMesh).text = "FULL";
		AudioSource.PlayClipAtPoint(comboFull, Vector3.zero);
		MessageOpen();
	}
	
	if(jsJudge.maxCombo % 10 != 0)
		open = false;
	
	if(closeCount == 0)
		transform.localScale.x = 0;
}


function MessageOpen() {
	transform.localScale.x = 4;
	animation.Stop();
	animation.Play("MessageBoxClose");
}