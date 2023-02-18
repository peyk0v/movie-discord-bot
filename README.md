# Discord BOT - Movie list
![image_presentation](https://github.com/NPeykov/movie-discord-bot/blob/main/presentation_files/movie-list-image.png)

## Introduction

The main purpose of this bot was to give me an excuse to make an approach to the world of Discord bots. Therefore, its purpose and usefulness are limited, nevertheless, in some concrete cases it can be useful.

The goal of this bot is to keep track of watched movies. Allowing you, using commands, to add, edit, delete and view a list of movies in a designated channel on our Discord server.

It can be useful for those Discord comunities that often watch movies together and want to keep a record on the same server of the movies they already watched. As I said earlier, its utility is limited.

## Setting up the bot on our Discord server
1. The first thing you need to do is invite the bot to your Discord server. To do this, you should use the following link:

    https://discord.com/api/oauth2/authorize?client_id=930213454990680126&permissions=108544&scope=bot

2. Once the bot appears in the users list as connected, we can start using the bot's provided commands.
    But first, we need to create an **empty movie list**. To do this, from the channel where we want to have the movie list, we must enter the following command:
    
    `!createEmptyFile`
    
    This will create an embedded file that will contain the list of the movies we add, edit or delete.    

3. Once we have the embedded file, the next logic step is to add a movie to the list. However, to be concise, here is a full list of available commands:

    | Command      | Description |
    | ----------- | ----------- |
    | !moviebot   | Show all available commands.       |
    | !createEmptyFile   | Create a file with an empty list |
    | !addMovie _link_ | Add the movie in the _link_ to the list  |
    | !deleteMovie _number_ | Delete the movie by it's number identifier |
    | !editMovie _number_ _link_ | Replace the movie at position _number_ with the movie linked to the _link_ |
    | !listRoles | List all roles on the server alongside a number that identifies them |
    | !addPermissionRole _number_ | Grant a role with the identifier: _number_ permission to use the bot |
    | !removePermissionRole _number_ | Revoke permission for role with identifier: _number_ to use the bot |



>NOTE: 
>
> - The bot expect to receive links from The Movie Data Base (TMDB). For example, if we want to add to the list the movie 'Shrek', we must provide to the bot the link:
    `!addMovie https://www.themoviedb.org/movie/808-shrek`
>
> - To use some commands, you should probably run another command previously. To be more clear, for example, if you want to grant or revoke permission to a rol, you'll probably want to know the number that identifies them. Therefore, it's logic to use the command !listRoles before.
>
> - After using any command, the sent command message itself will be deleted along with its response from the channel. It was designed this way so the channel only has one message, the movie list, and not any additional unnecessary messages.
