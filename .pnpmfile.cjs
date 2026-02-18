function readPackage(pkg, context) {
  // Ensure esbuild scripts are allowed
  if (pkg.name === 'esbuild') {
    pkg.scripts = pkg.scripts || {};
    pkg.allowScripts = true;
  }
  return pkg;
}

module.exports = {
  hooks: {
    readPackage
  }
};
