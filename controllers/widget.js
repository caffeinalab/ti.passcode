var args = arguments[0] || {};

var code = "";
var codeLength = 0;
var promptMode = false;
var errtimes = 0;
var cc = [];

var ERR_WIDTH = 30;
var ERR_TIME = 90;

var onSuccess = null;
var onError = null;
var onPromptSuccess = null;

exports.setOnSuccess = function(cb) {
	onSuccess = cb;
};

exports.setOnError = function(cb) {
	onError = cb;
};

exports.setOnPromptSuccess = function(cb) {
	onPromptSuccess = cb;
};

function setCode(c) {
	promptMode = false;
	code = c.toString().split('');
	codeLength = c.length;
}

function setPromptMode(len) {
	promptMode = true;
	code = null;
	codeLength = len;
}

function validate() {
	for (var i = 0; i < cc.length; i++) {
		if (cc[i] != code[i]) {
			return false;
		}
	}
	return true;
}

function process() {
	if (promptMode) {

		if (_.isFunction(onPromptSuccess)) onPromptSuccess(cc.join(''));

	} else {

		if (validate()) {
			errtimes = 0;
			if (_.isFunction(onSuccess)) onSuccess();
		} else {
			UI_reset(true);
			errtimes++;
			if (_.isFunction(onError)) onError(errtimes);
		}

	}
}

function UI_setCodeLength() {
	_.each($.oks.children || [], function($c) { $.oks.remove($c); });

	var INSET_OKS_MARGIN = Math.min(260, 90 - 20 * Math.floor(codeLength / 5));
	var INSET_OKS_WIDTH = 260 - (INSET_OKS_MARGIN * 2);
	var gap = INSET_OKS_WIDTH / (codeLength-1);

	for (var i = 0; i < codeLength; i++) {
		$.oks.add(Ti.UI.createView({
			width: 10,
			height: 10,
			borderColor: '#AFFF',
			borderWidth: 1,
			borderRadius: 5,
			center: {
				y: '50%',
				x: INSET_OKS_MARGIN + (i * gap) + 5
			}
		}));
	}
}


function UI_reset(animate) {
	cc = [];
	_.each($.oks.children, function($c){ $c.backgroundColor = 'transparent'; });

	if (animate) {
		var m = Ti.UI.create2DMatrix();
		var ms = [
			m.translate(-ERR_WIDTH, 0),
			m.translate(ERR_WIDTH, 0),
			m.translate(-ERR_WIDTH/2, 0),
			m.translate(ERR_WIDTH/2, 0),
			m
		];
		for (var i=0; i<ms.length; i++) {
			setTimeout(_.bind(function(j){
				$.oks.animate({ transform: ms[j], duration: ERR_TIME });
			}, {}, i), i * ERR_TIME);
		}
	}
}


/*
Listeners
*/

$.mask.addEventListener('touchstart', function(e){
	if (e.source.n == null) return;
	e.source.backgroundColor = '#AFFF';

	if (cc.length >= codeLength) return;
	cc.push(parseInt(e.source.n, 10));

	$.oks.children[cc.length-1].backgroundColor = '#AFFF';
	if (cc.length !== codeLength) return;

	process();
});

$.mask.addEventListener('touchend', function(e){
	if (e.source.n == null) return;
	e.source.backgroundColor = 'transparent';
});

$.dlBtn.addEventListener('touchstart', function(){
	if (cc.length > 0) {
		$.oks.children[cc.length-1].backgroundColor = 'transparent';
		cc.pop();
	}
});


/*
Pragma PUBLIC
*/

exports.setCode = function(c) {
	setCode(c);
	UI_setCodeLength();
};

exports.setPromptMode = function(l) {
	setPromptMode(l);
	UI_setCodeLength();
};

/*
Initial
*/

if (args.code != null) {
	exports.setCode(args.code);
} else if (args.promptMode != null) {
	exports.setPromptMode(args.promptMode);
}
