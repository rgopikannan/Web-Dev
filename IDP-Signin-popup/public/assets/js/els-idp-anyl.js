function getPageLoadTime() {
	var returnValue = '';
	if (typeof(performance) !== 'undefined' && typeof(performance.timing) == 'object') {
   		var timing = performance.timing;
   		var startTime = timing.redirectStart || timing.fetchStart || timing.requestStart;
   		var endTime = timing.domContentLoadedEventEnd || timing.domInteractive || timing.domComplete || timing.loadEventComplete;
   		if (startTime && endTime && startTime < endTime) returnValue = endTime - startTime;
	}
	return returnValue.toString();
}
