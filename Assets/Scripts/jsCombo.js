#pragma strict


function Start () {

}

function Update () {
	if(jsJudge.maxCombo > 0)
		transform.GetComponent(TextMesh).text = jsJudge.maxCombo+"";
	else
		transform.GetComponent(TextMesh).text = "";

}