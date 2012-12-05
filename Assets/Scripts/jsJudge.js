#pragma strict
import System.IO; 

/* 판정, 오토플레이 담당 */
var judgeMessage : Transform;
var scorePrint : Transform;

//게이지
var gaugeSize : Transform;	// 게이지 조절용
var gaugeColor : Transform; // 클리어 했을 시에 게이지 바 색깔을 노란색으로 바꾸기 위함
var clearOk : Transform; 	// 클리어시에 클리어! 표시를 하기 위함
static var clearGauge : float; // 게이지 계산
var gaugePercent : Transform;	// 몇 퍼센트?

// 오토플레이 모드
private var autoMode : boolean; // 오토플레이 여부
var vook : Transform;
private var beforeNote : int; // 0 : 큰북치고난 후, 1 : 오른쪽, 2 : 왼쪽

//콤보
static var maxCombo : int;
static var longHit : int; // 롱노트를 몇번이나 두들겼는가
var hitCountZone : Transform; // 힛 카운트를 표시
private var comboBonus : int;
var comboBonusPrint : Transform;

//판정 부분
var judPrint : Transform;
static var coolCount : int;
static var greatCount : int;
static var goodCount : int;
static var badCount : int;
static var missCount : int; // 각 판정의 갯수를 세기 위한 변수

//점수
static var totalScore : int;

private var coolJud : float = 0.3; // cool의 판정 범위
private var greatJud : float = 0.6; // great의 판정 범위
private var goodJud : float = 0.9; // good의 판정 범위
private var bigCount : int; // 큰 노트 처리용
private var bigCountX : float; // 큰 노트의 x 좌표 저장용

private var okNote : float;
private var okLongCount : int;




var noteArray = new Array(); // 노트를 저장하기 위한 자바스크립트 배열

function Start () {
	autoMode = false;
	beforeNote = 0;
	maxCombo = 0;
	bigCount = 0;
	bigCountX = 0;
	okNote = 0;
	okLongCount = 0;
	clearGauge = 0;
	comboBonus = 1;
	longHit = 0;
	totalScore = 0;
	
	
	
	//판정 변수 초기화
	coolCount=0;
	greatCount=0;
	goodCount=0;
	badCount=0;
	missCount=0;
}
function Update () {
	
	if(Input.GetKeyDown(KeyCode.F12)) {
		autoMode = true;	
	}
	
	if(noteArray.length > 0) {
		if(autoMode)
			AutoPlayMode();
		else
			NoteJudge();
			
		ClearRateCalc();
	}
	
	if(maxCombo >= 20 && maxCombo<40)
		comboBonus = 2;
	else if(maxCombo >= 40 && maxCombo<60)
		comboBonus = 3;
	else if(maxCombo >= 60 && maxCombo<80)
		comboBonus = 4;
	else if(maxCombo < 15)
		comboBonus = 1;
		
	scorePrint.GetComponent(TextMesh).text = totalScore+"";
	comboBonusPrint.GetComponent(TextMesh).text = "SCORE X"+comboBonus;
	
}
function ClearRateCalc() { // 게이지, 클리어 판정
	var temp : int;
	
	if(okNote>0)
		temp = ((okNote / jsMakeNote.totalNote) * 100)*10;
		
	clearGauge = temp / 10.0;
	gaugeSize.transform.localScale.x = clearGauge / 10;
	
	if(clearGauge >= 80.0) {
		gaugeColor.renderer.material = Resources.Load("Materials/ClearOk");
		clearOk.transform.localScale.y = 0.1;
	}
		
	
	if(temp % 10 == 0)
		gaugePercent.GetComponent(TextMesh).text = clearGauge + ".0%";
	else
		gaugePercent.GetComponent(TextMesh).text = clearGauge + "%";
	
	
}
function AutoPlayMode() {
	var temp : Collider = noteArray[0];
	var judgeCalc : float;
	
	judgeCalc = Mathf.Abs(transform.position.x - temp.transform.position.x);
	
	if(judgeCalc < 0.2) {
		if(temp.tag == 'BDONG' || temp.tag == 'SDONG') {
			if(temp.tag == 'BDONG') {
				Judgement(0.1, true, false);
				vook.SendMessage("KeyDownDongR", SendMessageOptions.DontRequireReceiver);
				vook.SendMessage("KeyDownDongL", SendMessageOptions.DontRequireReceiver);
				beforeNote = 0;
			}
			else if(temp.tag == 'SDONG') {
				Judgement(0.1, false, false);
				if(beforeNote == 0 || beforeNote == 4 || beforeNote == 2) {
					vook.SendMessage("KeyDownDongR", SendMessageOptions.DontRequireReceiver);
					beforeNote = 1;
				} else if(beforeNote == 3 || beforeNote == 1) {
					vook.SendMessage("KeyDownDongL", SendMessageOptions.DontRequireReceiver);
					beforeNote = 2;
				}
			}	
			noteArray.shift();
			Destroy(temp.gameObject);
		}
		else if(temp.tag == 'BKAT' || temp.tag == 'SKAT') {
			if(temp.tag == 'BKAT') {
				Judgement(0.1, true, false);
				vook.SendMessage("KeyDownKatR", SendMessageOptions.DontRequireReceiver);
				vook.SendMessage("KeyDownKatL", SendMessageOptions.DontRequireReceiver);
				beforeNote = 0;
			}
			else if(temp.tag == 'SKAT') {
				Judgement(0.1, false, false);
				if(beforeNote == 0 || beforeNote == 2 || beforeNote == 4) {
					vook.SendMessage("KeyDownKatR", SendMessageOptions.DontRequireReceiver);
					beforeNote = 3;
				} else if(beforeNote == 1 || beforeNote == 3) {
					vook.SendMessage("KeyDownKatL", SendMessageOptions.DontRequireReceiver);
					beforeNote = 4;
				}
			}
			
			noteArray.shift();
			Destroy(temp.gameObject);
		}
		else if(temp.tag == 'BLONG' || temp.tag == 'SLONG') {
			if(temp.tag == 'BLONG') {
				Judgement(0.1, true, true);
				vook.SendMessage("KeyDownDongR", SendMessageOptions.DontRequireReceiver);
				vook.SendMessage("KeyDownDongL", SendMessageOptions.DontRequireReceiver);
			}
			else if(temp.tag == 'SLONG') {
				Judgement(0.1, false, true);
				if(beforeNote == 0 || beforeNote == 4 || beforeNote == 2) {
					vook.SendMessage("KeyDownDongR", SendMessageOptions.DontRequireReceiver);
					beforeNote = 1;
				} else if(beforeNote == 1 || beforeNote == 3) {
					vook.SendMessage("KeyDownDongL", SendMessageOptions.DontRequireReceiver);
					beforeNote = 2;
				}
			}
			
			noteArray.shift();
		}
	}

}
function NoteJudge() {
	var judgeCalc : float = 0.4;
	var temp : Collider = noteArray[0]; // 노트 배열에 저장되어 있는 첫번째 노트를 가져온다.
	
	judgeCalc = Mathf.Abs(transform.position.x - temp.transform.position.x); // 얼마나 정확한 타이밍에 노트를 눌렀는지를 계산하는 변수
	
	if(bigCount == 1) { 										/* 큰 노트를 한번만 친 경우에도 점수는 절반이지만 인식은 되어야 함 */
		if(bigCountX - 0.2 > temp.transform.position.x) {		/* 큰 노트를 한번 쳤을때의 좌표값에서 0.2가 넘게 빠져도 다른쪽 노트를 안쳤을 때 노트 파괴 */
			noteArray.shift();
			Destroy(temp.gameObject);
			bigCount = 0;
			bigCountX=0;
		}
	}
		
	if(temp.transform.position.x < -5.8) {
		if(temp.tag.Substring(1, 3) != "LON") { // 롱노트가 아닌 경우
			judPrint.SendMessage("JudMiss", SendMessageOptions.DontRequireReceiver); // MISS 판정 표시
			maxCombo=0; // 각종 수치 초기화
			bigCount = 0;
			bigCountX=0;
		}
		noteArray.shift(); // 노트가 판정선을 벗어나는데도 플레이어가 버튼을 누르지 않았을 경우, 배열에서 빼버린다.
	}
	
	if(temp.tag.Substring(1, 3) == "KAT") {	 	// 캇 노트를 치는 경우
		if(temp.tag == "SKAT")  { 				// 작은 캇 노트를 쳤을 때
			if(Input.GetButtonDown("Kat1") || Input.GetButtonDown("Kat2")) {
				Judgement(judgeCalc, false, false); // 판정을 내리자
				noteArray.shift(); 					// 배열에서 해당 노트를 뺀다
				Destroy(temp.gameObject); // 노트를 제거 한다.
			}
		} else if(temp.tag == "BKAT") { 		// 큰 캇노트를 쳤을 때
			if(Input.GetButtonDown("Kat1")) { 	// 한쪽 북만 두드린 경우
				if(bigCount==0)
					Judgement(judgeCalc, false, false);
					
				bigCount+=1;
				bigCountX = temp.transform.position.x; // 현재 노트의 x 좌표 저장 
			} 
			if(Input.GetButtonDown("Kat2")) { 		// 한쪽 북만 두드린 경우
				if(bigCount==0)
					Judgement(judgeCalc, false, false);
					
				bigCount+=1;
				bigCountX = temp.transform.position.x;
			} 
			
			if(bigCount == 2) { 			/* 큰 노트의 경우, 양쪽을 두들겼을때 점수를 두배로 주기 위함 */
				noteArray.shift();			/* 동시 두개입력으로 해놓으면 플레이어가 정확히 두개를 동시에 입력하기 쉽지 않으므로 */
				Destroy(temp.gameObject);	/* 두번에 나눠서 쳐도 입력되도록 처리 */
				bigCount = 0;
				bigCountX = 0;
			}
		}
		
		
	}
	else if(temp.tag.Substring(1, 4) == "DONG") {	// 동 노트를 치는 경우
		if(temp.tag == "SDONG")  { 					// 작은 캇 노트를 쳤을 때
			if(Input.GetButtonDown("Dong1") || Input.GetButtonDown("Dong2")) {
				Judgement(judgeCalc, false, false); // 판정을 내리자
				noteArray.shift();
				Destroy(temp.gameObject);
			}
		} else if(temp.tag == "BDONG") { 		// 큰 동노트를 쳤을 때
			if(Input.GetButtonDown("Dong1")) { // 한쪽 북만 두드린 경우
				bigCount+=1;
				Judgement(judgeCalc, false, false);
				bigCountX = temp.transform.position.x;
			} 
			if(Input.GetButtonDown("Dong2")) { // 한쪽 북만 두드린 경우
				bigCount+=1;
				Judgement(judgeCalc, false, false);
				bigCountX = temp.transform.position.x;
			} 
			
			if(bigCount == 2) {
				noteArray.shift();
				Destroy(temp.gameObject);
				bigCount = 0;
				bigCountX = 0;
			}
		}
	}
	else if(temp.tag.Substring(1, 4) == "LONG") { // 롱노트를 치는 경우
		if(Input.GetButtonDown("Dong1") || Input.GetButtonDown("Dong2") || Input.GetButtonDown("Kat1") || Input.GetButtonDown("Kat2")) {
			Judgement(judgeCalc, false, true); // 판정을 내리자
		}
	}
	
}
function OnTriggerEnter(coll : Collider) {
	
	noteArray.push(coll); // 노트를 저장할 배열에 부딪힌 collider(노트)를 push 한다.
	
	if(coll.name == "LongNote_Big - Start(Clone)" || coll.name == "LongNote_Small - Start(Clone)") {
		longHit = 0;
		print("롱노트 Hit 카운터 초기화");
	}
}
function OnTriggerExit(coll : Collider) {
	if(coll.name == "LongNote_Big - End(Clone)" || coll.name == "LongNote_Small - End(Clone)") {
		okLongCount = 0;
		hitCountZone.SendMessage("TransformClose", SendMessageOptions.DontRequireReceiver);
		print("카운터 초기화");
	}
	
}

function Judgement(judgeCalc : float, notesize : boolean, longnote : boolean) {
	if(longnote == false) {
		if(notesize == false) { // notesize는 큰노트, 작은노트를 구별하기 위함. 작은 노트를 쳤을 때
			if(judgeCalc < coolJud) {
				if(bigCount < 2) { // 큰노트를 친 경우 콤보는 한번만 올라가게 하기 위함
					maxCombo++;
					coolCount++; // cool 카운트를 올린다
					okNote+=1;
				}
				judPrint.SendMessage("JudCool", SendMessageOptions.DontRequireReceiver);
				totalScore += 530 * comboBonus;
			}
			else if(judgeCalc >= coolJud && judgeCalc < greatJud) {
				if(bigCount < 2) {
					maxCombo++;
					greatCount++; // great 카운트를 올린다
					okNote+=0.8;
				}
				judPrint.SendMessage("JudGreat", SendMessageOptions.DontRequireReceiver);
				totalScore += 490 * comboBonus;
			}
			else if(judgeCalc >= greatJud && judgeCalc < goodJud) {
				if(bigCount < 2) {
					maxCombo++;
					goodCount++; // good 카운트를 올린다 
					okNote+=0.5;
				}
				judPrint.SendMessage("JudGood", SendMessageOptions.DontRequireReceiver);
				totalScore += 430 * comboBonus;
			}
			else if(judgeCalc > goodJud) {
				maxCombo = 0;
				badCount++; // bad 카운트를 올린다
				judPrint.SendMessage("JudBad", SendMessageOptions.DontRequireReceiver);
				totalScore += 210 * comboBonus;
			}
		}
		else if(notesize == true) { // 큰 노트를 쳤을 때(오토플레이용)
			if(judgeCalc < coolJud) {
				maxCombo++;
				coolCount++; // cool 카운트를 올린다
				okNote+=1;
				judPrint.SendMessage("JudCool", SendMessageOptions.DontRequireReceiver);
				totalScore += 1060 * comboBonus;
			}
		}
	}
	else {
		if(notesize == false) { // notesize는 큰노트, 작은노트를 구별하기 위함. 작은 노트를 쳤을 때
			longHit++;
			judPrint.SendMessage("JudCool", SendMessageOptions.DontRequireReceiver);
			totalScore += 110 * comboBonus;
		}
		else if(notesize == true) { // 큰 노트를 쳤을 때
			longHit++;
			judPrint.SendMessage("JudCool", SendMessageOptions.DontRequireReceiver);
			totalScore += 220 * comboBonus;
		}
		
		if(okLongCount < 1) {
			okLongCount++; // 롱노트는 클리어 %에 한번만 판정하기 위한 변수
			okNote+=1;
			maxCombo+=1;
			coolCount++;
		}
		
		if(longHit == 1)
			hitCountZone.SendMessage("TransformOpen", SendMessageOptions.DontRequireReceiver);
			
			
	}
}