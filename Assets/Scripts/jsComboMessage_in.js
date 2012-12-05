#pragma strict

var comboOut : Transform;

function Start () {

}

function Update () {

	transform.GetComponent(TextMesh).text = comboOut.GetComponent(TextMesh).text;

}