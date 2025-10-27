# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

**JARVIS 2.0** is a modern AI chatbot powered by Groq's Llama-3.3-70b-versatile model. Built with Node.js and Express, it provides an interactive web interface with real-time AI responses.

## Build and Run Commands

### Compilation

**Linux/Mac:**
```bash
c++ src/chanakya.cpp -std=c++0x
```

**Windows:**
```cmd
cl src/chanakya.cpp
```

### Execution

**Linux/Mac:**
```bash
./a.out
```

**Windows:**
```cmd
chanakya
```

### Configuration

Before running, edit `config/prog.config` to set the chatbot's domain:
```
name = Chanakya
field = <topic name>
knowledge_file = ../data/<filename>.chat
knowledge_type = chat
```

Available knowledge bases are in the `/data` directory (e.g., `tajmahal.chat`, `bengaltiger.chat`, `shopsample.chat`).

## Architecture

### Core Components

**Knowledge Representation (Tree-Based System):**
- `InformationTree`: Root data structure that holds the entire knowledge hierarchy
- `TreeNode`: Individual nodes containing an ID, children nodes, and file positions for keywords and values
- Memory-efficient design: Instead of storing keywords/values in memory, nodes store file cursor positions and read data on-demand from `.chat` files

**Knowledge File Format (`.chat` syntax):**
- `node1 < parent`: Defines parent-child relationship (tree structure)
- `node1 : keyword1 keyword2|alternative keyword3 .`: Associates keywords with a node (pipe `|` for alternatives)
- `node1 = This is the answer value .`: Assigns the response value to a leaf node
- File positions are cached to enable lazy loading of keywords and values

**Query Processing Flow:**
1. User input is tokenized into a vector of words (`InputScanner`)
2. Starting from root, traverse tree by comparing user words against each child node's keywords (`StringMatcher`)
3. Calculate comparison scores: +1 for matching keywords, -1 for non-matching keywords
4. Select child with highest score and repeat until reaching a leaf node
5. Display the leaf node's value as the answer

**String Matching (`StringMatcher`):**
- Compares user sentence words against node keywords
- Supports keyword alternatives separated by `|` (e.g., `who|whom|which`)
- Scoring algorithm: increment for matches, decrement for missing required keywords
- Does not require exact grammar or word order

**Plugin System:**
- Interface: `Plugin` class (pure virtual) in `include/plugins/plugin.h`
- Plugins provide live data beyond static knowledge bases
- Currently implemented: Movies plugin (`plugins/movies/`)
- Activated via "offtopic" command, deactivated via "ontopic"
- `Plugins` manager class handles routing between main knowledge base and plugins

**File Validation:**
- `ConfigValidator`: Validates `prog.config` syntax before startup
- `KnowledgeBaseValidator`: Validates `.chat` file syntax
- Both report errors with line numbers if validation fails

### Directory Structure

- `/src` - Main entry point (`chanakya.cpp`)
- `/include` - All header files organized by functionality:
  - `knowledge-tree/` - Tree data structures and builders
  - `plugins/` - Plugin system interfaces
  - `file-validation/` - Config and knowledge base validators
  - `user-input/` - Input scanning and processing
  - `utilities/` - Helper functions (config reader, HTML tag removal, text formatting)
- `/data` - Knowledge base `.chat` files
- `/config` - Configuration file (`prog.config`)
- `/plugins` - Plugin implementations (e.g., `movies/`)

## Key Design Patterns

**Memory Optimization:** Instead of loading entire knowledge base into memory, the system stores file positions in nodes and reads data lazily when needed. This allows scalability to large knowledge bases.

**Expert System Approach:** Knowledge is represented as a tree where internal nodes represent questions/topics and leaf nodes contain answers. The traversal algorithm selects paths based on keyword matching scores.

**Extensibility via Plugins:** Main knowledge base handles static topics while plugins can fetch live data from external sources (designed for web scraping, though implementation may need updates).

## Development Notes

- No external build system (Make/CMake) is used; compile with direct C++ compiler commands
- Standard library only: Uses `<iostream>`, `<fstream>`, `<vector>`, `<string>`, `<regex>`, `<stack>`, `<array>`
- C++11 minimum (`-std=c++0x` flag)
- Windows uses MSVC (`cl`), Unix uses Clang/GCC (`c++`)
- File paths are hardcoded as relative paths from `/src` execution directory (e.g., `../config/`, `../data/`)
- Output binary: `a.out` (Unix) or `chanakya.exe` (Windows)
