#ifndef __LP_TEST_TIMER__
#define __LP_TEST_TIMER__

#include <ctime>

////////////////////////////////////////////////////////////////////////////////
//
//
// A timer, for perfomance testing
//
//

struct timer {
	clock_t t;
	void start() {t = clock();}
	double stop() {return (1.0 * clock() - t) / CLOCKS_PER_SEC;}
};

#endif
