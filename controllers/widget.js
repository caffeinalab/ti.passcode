var args = arguments[0] || {};

var code = null;
var onSuccess = null;
var onError = null;

var errtimes = 0;

var cc = [];

var ERR_WIDTH = 30;
var ERR_TIME = 90;

function setCode(c) {
	code = c.split('');
	_.each($.oks.children || [], function($c) { $.oks.remove($c); });

	var INSET_OKS_MARGIN = Math.min(260, 90-20*Math.floor(code.length/5));
	var INSET_OKS_WIDTH = 260 - (INSET_OKS_MARGIN*2);
	var gap = INSET_OKS_WIDTH/(code.length-1);

	for (var i=0; i<code.length; i++) {
		$.oks.add(Ti.UI.createView({
			width: 10,
			height: 10,
			borderColor: "#AFFF",
			borderWidth: 1,
			borderRadius: 5,
			center: { y: "50%", x: INSET_OKS_MARGIN+(i*gap)+5 }
		}));
	}
}

function setOnSuccessCallback(callback) {
	onSuccess = callback;
}

function setOnErrorCallback(callback) {
	onError = callback;
}

function reset(animate) {
	cc = [];
	_.each($.oks.children, function($c){ $c.backgroundColor = "transparent"; });

	if (animate) {
		var m = Ti.UI.create2DMatrix();
		var ms = [m.translate(-ERR_WIDTH,0),m.translate(ERR_WIDTH,0),m.translate(-ERR_WIDTH/2,0),m.translate(ERR_WIDTH/2,0),m];
		for (var i=0; i<ms.length; i++) {
			setTimeout(_.bind(function(j){
				$.oks.animate({ transform: ms[j], duration: ERR_TIME });
			}, {}, i), i*ERR_TIME);
		}
	}
}

function validate() {
	for (var i=0; i<cc.length; i++) {
		if (cc[i]!=code[i]) return false;
	}
	return true;
}

function process() {
	if (validate()) {
		reset(false);
		errtimes = 0;
		if (_.isFunction(onSuccess)) onSuccess();
		else {
			Ti.API.warn("com.caffeinalab.titanium.passcode: User entered valid code but no 'onSuccess' callback has been defined");
		}
	} else {
		reset(true);
		errtimes++;
		if (_.isFunction(onError)) onError(errtimes);
	}
}

$.dlBtn.addEventListener('touchstart', function(){
	if (cc.length>0) {
		$.oks.children[cc.length-1].backgroundColor = "transparent";
		cc.pop();
	}
});

$.mask.addEventListener('touchstart', function(e){
	if (e.source.n===undefined) return;
	e.source.backgroundColor = "#AFFF";

	cc.push(parseInt(e.source.n,10));
	if (cc.length>code.length) return;

	$.oks.children[cc.length-1].backgroundColor = "#AFFF";
	if (cc.length!==code.length) return;

	setTimeout(process, 100);
});

$.mask.addEventListener('touchend', function(e){
	if (e.source.n===undefined) return;
	e.source.backgroundColor = "transparent";
});

/*
Initial
*/

setCode( args.code || '0000' );

/*
Pragma PUBLIC
*/

exports.setCode = setCode;
exports.setNext = setOnSuccessCallback;
exports.onSuccess = setOnSuccessCallback;
exports.onError = setOnErrorCallback;