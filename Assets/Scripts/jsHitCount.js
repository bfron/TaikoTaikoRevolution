#pragma strict

function Start () {

}

function Update () {

	if(jsJudge.longHit > 0)
		transform.GetComponent(TextMesh).text = jsJudge.longHit+"";

}