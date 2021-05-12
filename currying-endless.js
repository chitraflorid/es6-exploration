const func = (word, prefix = 'hi') => {
    if (word) {
        return `${prefix}${word}`;
    }
    
    return (word) => {
      prefix = `${prefix}i`;
      
      return func(word, prefix);
    }
}

/*
func("world") --> returns --> hiworld
func()("world") --> returns --> hiiworld
func()()("world") --> returns --> hiiiworld
func()()()("world") --> returns --> hiiiiworld
func()()()()("world") --> returns --> hiiiiiworld
func()()()()()("world") --> returns --> hiiiiiiworld
*/
