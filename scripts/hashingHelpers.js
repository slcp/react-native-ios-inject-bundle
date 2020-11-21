const makeOutput = (path, file) => `${path}: ${file.hash}`

const handleChildren = (children, path = "") => children.map(child => {
    if (typeof child === "object") {
        return handleEntity(child, path ? `${path}/${child.name}` : child.name)
    }
    throw new Error(`Unexepcted child type: child is of type ${typeof child}`)
})

const handleEntity = (entity, path = "") => {
    if (entity.children) {
        return handleChildren(entity.children, path || entity.name)
    }
    return makeOutput(path, entity)
}

const handleResult = result => {
    if (typeof result === 'object') {
        return handleEntity(result, result.name)
    } else if (Array.isArray(result)) {
        return handleChildren(result)
    }
}

module.exports = {handleResult}
