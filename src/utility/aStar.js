// import './style.css'

function calcHeuristic(currNode, goalNode) {
    const D = 10; // non-diagonal move cost
    const D2 = 14; // diagonal move cost

    let dx = Math.abs(currNode.renderObj.position.x - goalNode.renderObj.position.x);
    let dy = Math.abs(currNode.renderObj.position.y - goalNode.renderObj.position.y);

    return D * (dx + dy) + (D2 - 2 * D) * Math.min(dx, dy);
}