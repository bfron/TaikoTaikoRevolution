#pragma strict

//var speed = 5 * Time.deltaTime;

private var moveSpeed : float = jsMakeNote.inputBpm / 60;

var start = false;
function Start () {
	/*var starttime = (60 / jsMakeNote.inputBpm) * 4;
	yield WaitForSeconds(starttime);
	*/
	start = true;
	

}

function Update () {
	if(jsMakeNote.moveNote)
		transform.Translate(Vector3.left * (moveSpeed * 3) * Time.deltaTime);
	
	if(transform.position.x < -10)
		Destroy(gameObject);
	
}

/* 노트가 움직이는 속도는 bpm/60 * 2 로 한다(2배속 기준) */