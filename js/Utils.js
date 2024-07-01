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


function FindRecursive(node, classname)
{
    if(node.className && node.className.indexOf && node.className.indexOf(classname) != -1)
        return node;
    
    let target = null;
    let children = node.children;
    if(!children)
        return target;

    children = Array.from(children);
    for(let child of children)
    {
        target = FindRecursive(child, classname);
        if(target)
            break;
    } 

    return target;
}