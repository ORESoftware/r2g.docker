#!/usr/bin/env bash

set -e;

if [[ "$dkr2g_skip_postinstall" == "yes" ]]; then
   echo "dkr2g is skipping postinstall routine.";
   exit 0;
fi

export dkr2g_skip_postinstall="yes";

r2g_gray='\033[1;30m'
r2g_magenta='\033[1;35m'
r2g_cyan='\033[1;36m'
r2g_orange='\033[1;33m'
r2g_green='\033[1;32m'
r2g_no_color='\033[0m'


mkdir -p "$HOME/.oresoftware" || {
  echo "could not create '$HOME/.oresoftware'";
  exit 1;
}

(

    shell_file="node_modules/@oresoftware/shell/assets/shell.sh";
    [ -f "$shell_file" ] && cat "$shell_file" > "$HOME/.oresoftware/shell.sh" && {
        echo "Successfully copied @oresoftware/shell/assets/shell.sh to $HOME/.oresoftware/shell.sh";
        exit 0;
    }

    shell_file="../shell/assets/shell.sh";
    [ -f "$shell_file" ] &&  cat "../shell/assets/shell.sh" > "$HOME/.oresoftware/shell.sh" && {
        echo "Successfully copied @oresoftware/shell/assets/shell.sh to $HOME/.oresoftware/shell.sh";
        exit 0;
    }

    curl -H 'Cache-Control: no-cache' \
         "https://raw.githubusercontent.com/oresoftware/shell/master/assets/shell.sh?$(date +%s)" \
          --output "$HOME/.oresoftware/shell.sh" 2> /dev/null || {
           echo "curl command failed to read shell.sh";
           exit 1;
    }
)


mkdir -p "$HOME/.oresoftware/execs" || {
    echo "could not create execs directory in $HOME/oresoftware.";
}


mkdir -p "$HOME/.oresoftware/bash" || {
    echo "could not mkdir '$HOME/.oresoftware/bash'" >&2;
    exit 1;
}

cat assets/shell.sh > "$HOME/.oresoftware/bash/dkr2g.sh" || {
      echo "could not copy read_json.sh shell file to user home." >&2;
      exit 1;
}


mkdir -p "$HOME/.oresoftware/nodejs/node_modules" ||{
  echo "could not create complete dir path in user home." >&2;
  exit 1;
}


(

    if [ -f "$HOME/.oresoftware/nodejs/package.json" ]; then
       exit 0;
    fi

    json_file="node_modules/@oresoftware/shell/assets/package.json";
    [ -f "$json_file" ] && cat "$json_file" > "$HOME/.oresoftware/nodejs/package.json" && {
       echo "Successfully copied @oresoftware/shell/assets/package.json to $HOME/.oresoftware/nodejs/package.json";
       exit 0;
    }

    json_file="../shell/assets/package.json";
    [ -f "$json_file" ] && cat "$json_file" > "$HOME/.oresoftware/nodejs/package.json" && {
       echo "Successfully copied @oresoftware/shell/assets/package.json to $HOME/.oresoftware/nodejs/package.json";
       exit 0;
    }

    curl -H 'Cache-Control: no-cache' \
          "https://raw.githubusercontent.com/oresoftware/shell/master/assets/package.json?$(date +%s)" \
            --output "$HOME/.oresoftware/nodejs/package.json" 2> /dev/null  && {

       echo "Successfully copied package.json file from Github repo.";
       exit 0;
    }

     echo "curl command failed to read package.json, now we should try wget..." >&2
     exit 1;

)



echo "";
echo -e "${r2g_green} => dkr2g was installed successfully.${r2g_no_color}";
echo -e "Add the following line to your .bashrc/.bash_profile files:";
echo -e "${r2g_cyan}. \"\$HOME/.oresoftware/shell.sh\"${r2g_no_color}";
echo "";
