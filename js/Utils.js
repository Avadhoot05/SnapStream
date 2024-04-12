function GetThrottleFunction(fn, limit)
{
    let bCanRun = true;

    return (...args) => {
        if(!bCanRun) 
            return;
        
        bCanRun = false;
        fn(...args);
        setTimeout(() => {
            bCanRun = true;
        }, limit);
    };
}