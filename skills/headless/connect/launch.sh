#!/bin/sh
# Hostinger Headless — what coding tools register on macOS and Linux: /bin/sh <home>/.hostinger/mcp/launch.sh
# /bin/sh never moves, and node is looked up only here, after moving to the home folder, so a Node
# upgrade (Homebrew, nvm, asdf) keeps the registration working, and a version manager's shim picks the
# user's own Node, never the one a project's .tool-versions names. Relative and node_modules entries
# are dropped from PATH first: either could hold a node the project put there.
# The server returns to the project once started (relative paths in tool arguments), so name it first.
MCP_PROJECT_DIR=$(pwd)
export MCP_PROJECT_DIR
cd || exit 1
set -f
safe=
IFS=:
for dir in $PATH; do
  case $dir in
    /*node_modules*) ;;
    /*) safe=${safe:+$safe:}$dir ;;
  esac
done
unset IFS
PATH=$safe
export PATH
exec node "${0%/*}/launch.mjs" "$@"
