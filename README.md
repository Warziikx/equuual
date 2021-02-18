# Node Skeleton

C'est un simple projet skeleton pour node.js avec Express, Sequelize

## Installation

Supprimmer tout les fichiers "init" (utilisé pour push les dossiers)

Installer les packages npm avec :

```
npm install
```

Changer les paramètres de la base de données dans :

```
config/config.json
```

La configuration est faite de façon à régler les dates sur notre fuseau horaire.

## Générer les modeles

### Prérequis

Pour générer les modeles il faut installer sequelize-auto :

```
npm install -g sequelize-auto
```

Il faut également installer la librairie de dialecte globalement

Exemple pour SQL Server

```
npm install -g mssql
```

### Usage

    [node] sequelize-auto -h <host> -d <database> -u <user> -x [password] -p [port]  --dialect [dialect] -c [/path/to/config] -o [/path/to/models] -t [tableName] -C

    Options:
      -h, --host        IP/Hostname de la BDD.          [requis]
      -d, --database    Nom de la BDD.                  [requis]
      -u, --user        Nom d'utilisateur de BDD.
      -x, --pass        Mot de passe de la BDD.
      -p, --port        Port de la BDD.
      -c, --config      JSON file for Sequelize's constructor "options" flag object as defined here: https://sequelize.readthedocs.org/en/latest/api/sequelize/
      -o, --output      What directory to place the models.
      -e, --dialect     The dialect/engine that you're using: postgres, mysql, sqlite
      -a, --additional  Path to a json file containing model definitions (for all tables) which are to be defined within a model's configuration parameter. For more info: https://sequelize.readthedocs.org/en/latest/docs/models-definition/#configuration
      -t, --tables      Comma-separated names of tables to import
      -T, --skip-tables Comma-separated names of tables to skip
      -C, --camel       Use camel case to name models and fields
      -n, --no-write    Prevent writing the models to disk.
      -s, --schema      Database schema from which to retrieve tables
      -z, --typescript  Output models as typescript with a definitions file.

### Exemple

    sequelize-auto -o "./src/models" -d 192.168.0.20 -h PRESSE_GESTION -u sa -p 1433 -x sa -e mssql -C
