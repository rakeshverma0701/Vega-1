var module = {
  name: "Shell Injection Checks",
  category: "Injection Modules"
};

function initialize(ctx) {
  ctx.submitMultipleAlteredRequests(process, ["`true`", "`false`", "`uname`", "\"`true`\"", "\"`false`\"", "\"`uname`\"", "'true'", "'false'", "'uname'"], true);
}

function process(req, res, ctx) {
  if (ctx.hasModuleFailed()) return;
  if (res.fetchFail) {
    ctx.error(req, res, "During shell injection checks");
    ctx.setModuleFailed();
    return;
  }

  ctx.addRequestResponse(req, res);
  if (ctx.incrementResponseCount() < 9) return;

  checkMatch(ctx, 0);
  checkMatch(ctx, 3);
  checkMatch(ctx, 6);
}

function checkMatch(ctx, idx) {
  if (ctx.isFingerprintMatch(idx, idx + 1) && !ctx.isFingerprintMatch(idx, idx + 2)) {
    ctx.alert("vinfo-shell-inject",  ctx.getSavedRequest(idx), ctx.getSavedResponse(idx), {
      message: "responses to `true` and `false` are different than `uname`",
      resource: ctx.getSavedRequest(idx)
    });
    ctx.responseChecks(idx + 2);
  }
}
