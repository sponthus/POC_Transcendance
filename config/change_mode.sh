#!/bin/bash

ENV_FILE=.env

echo "---- Configuration of your environment ----"
echo "------------- Changing mode ---------------"
echo "	$2 mode					"

if [ ! -f "$ENV_FILE" ]; then
		echo " ✘ No $ENV_FILE found";
		return 1
fi

replace_variable() {
	local variable="$1"
  local replacement="$2"

  if [ -z "$variable" ] || [ -z "$replacement" ]; then
      echo " ✘ Error: variable and replacement required"
      return 1
  fi
	if ! grep -q "^$variable=" "$ENV_FILE"; then
  	echo " ✘ $ENV_FILE is invalid, recreating .env"
  	sh ./config/init_env.sh
  	return $?
  fi

	#	Escape special char from replacement, for sed
	local escaped_replacement=$(printf '%s\n' "$replacement" | sed 's/[[\.*^$()+?{|]/\\&/g')
  if sed -i "s|^$variable=.*|$variable=$escaped_replacement|" "$ENV_FILE"; then
  	echo " ✓ $variable replaced with: $replacement"
  else
  	return 1
  fi
  return 0
}

echo "-------------------------------------------"

if replace_variable $1 $2; then
    echo "✓ Success"
else
    echo "✘ Failure"
fi