import { revertCase } from "@/features/chat/chat-services/chat-translator-service"

// Test cases
// const testCases: { title: string; originalText: string; translatedText: string; expectedText: string }[] = [
//   {
//     title: "should revert cases",
//     originalText: "Hello, WORLD!",
//     translatedText: "hello, world!",
//     expectedText: "Hello, WORLD!",
//   },
//   {
//     title: "should handle missing original words",
//     originalText: "Hello W suMmarization QCHAT!",
//     translatedText: "hello world w summarisation qchat!",
//     expectedText: "Hello World W suMmarisation QCHAT!",
//   },
//   {
//     title: "should handle capital after code block",
//     originalText: "Welcome to QChat,\n\n__codeblock_1__\n\n**Color**",
//     translatedText: "welcome to qchat,\n\n__codeblock_1__\n\n**colour**",
//     expectedText: "Welcome to QChat,\n\n__codeblock_1__\n\n**Colour**",
//   },
//   {
//     title: "should handle words wrapped in single backtick",
//     originalText: "`IF`, `COLOR`, and `INDIRECT`",
//     translatedText: "'if', 'colour', and 'indirect'",
//     expectedText: "`IF`, `COLOUR`, and `INDIRECT`",
//   },
//   {
//     title: "should handle extra or missing spaces",
//     originalText: "Hello __codeblock_1__\n\n    Color WORLD! Bye!",
//     translatedText: "hello __codeblock_1__\n\n    colour world! bye!",
//     expectedText: "Hello __codeblock_1__\n\n    Colour WORLD! Bye!",
//   },
//   {
//     title: "should handle stars after code blocks",
//     originalText: "Welcome to QChat,\n\n__codeblock_1__\n*Color*",
//     translatedText: "welcome to qchat,\n\n__codeblock_1__\n*colour*",
//     expectedText: "Welcome to QChat,\n\n__codeblock_1__\n*Colour*",
//   },
//   {
//     title: "should handle single quote and backtick",
//     originalText: "`'Tab1'!E2:E100=\"Yes\"`",
//     translatedText: "''tab1'!e2:e100=\"yes\"'",
//     expectedText: "`'Tab1'!E2:E100=\"Yes\"`",
//   },
// ]

// for (const testCase of testCases) {
//   it(testCase.title, () => {
//     // Arrange
//     const { originalText, translatedText, expectedText } = testCase
//     // Act
//     const actual = revertCase(originalText, translatedText)
//     // Assert
//     expect(actual).toBe(expectedText)
//   })
// }

describe("translator", () => {
  it("should handle empty string", () => {
    // Arrange
    const originalText = ""
    const translatedText = ""
    const expected = ""

    // Act
    const actual = revertCase(originalText, translatedText)

    // Assert
    expect(actual).toBe(expected)
  })

  it("should revert cases", () => {
    // Arrange
    const originalText = "Hello, WORLD!"
    const translatedText = "hello, world!"
    const expected = "Hello, WORLD!"

    // Act
    const actual = revertCase(originalText, translatedText)

    // Assert
    expect(actual).toBe(expected)
  })

  it("should handle extra letters in translated version", () => {
    // Arrange
    const originalText = "Color COLORS!"
    const translatedText = "colour colours!"
    const expected = "Colour COLOURS!"

    // Act
    const actual = revertCase(originalText, translatedText)

    // Assert
    expect(actual).toBe(expected)
  })

  it("should handle missing original words", () => {
    // Arrange
    const originalText = "Hello W suMmarization QCHAT!"
    const translatedText = "hello world w summarisation qchat!"
    const expected = "Hello World W suMmarisation QCHAT!"

    // Act
    const actual = revertCase(originalText, translatedText)

    // Assert
    expect(actual).toBe(expected)
  })

  it("should handle capital after code block", () => {
    // Arrange
    const originalText = "Welcome to QChat,\n\n__codeblock_1__\n\n**Color**"
    const translatedText = "welcome to qchat,\n\n__codeblock_1__\n\n**colour**"
    const expected = "Welcome to QChat,\n\n__codeblock_1__\n\n**Colour**"

    // Act
    const actual = revertCase(originalText, translatedText)

    // Assert
    expect(actual).toBe(expected)
  })

  it("should handle words wrapped in single backtick", () => {
    // Arrange
    const originalText = "`IF`, `COLOR`, and `INDIRECT`"
    const translatedText = "'if', 'colour', and 'indirect'"
    const expected = "`IF`, `COLOUR`, and `INDIRECT`"

    // Act
    const actual = revertCase(originalText, translatedText)

    // Assert
    expect(actual).toBe(expected)
  })

  it("should handle extra or missing spaces", () => {
    // Arrange
    const originalText = "Hello     __codeblock_1__\n\n    Color WORLD! Bye!"
    const translatedText = "hello __codeblock_1__\n\n    colour world! bye!"
    const expected = "Hello __codeblock_1__\n\n    Colour WORLD! Bye!"

    // Act
    const actual = revertCase(originalText, translatedText)

    // Assert
    expect(actual).toBe(expected)
  })

  it("should handle stars after code blocks", () => {
    // Arrange
    const originalText = "Welcome to QChat,\n\n__codeblock_1__\n*Color*"
    const translatedText = "welcome to qchat,\n\n__codeblock_1__\n*colour*"
    const expected = "Welcome to QChat,\n\n__codeblock_1__\n*Colour*"

    // Act
    const actual = revertCase(originalText, translatedText)

    // Assert
    expect(actual).toBe(expected)
  })

  it("should handle single quote and backtick", () => {
    // Arrange
    const originalText = "`'Tab1'!E2:E100=\"Yes\"`"
    const translatedText = "''tab1'!e2:e100=\"yes\"'"
    const expected = "`'Tab1'!E2:E100=\"Yes\"`"

    // Act
    const actual = revertCase(originalText, translatedText)

    // Assert
    expect(actual).toBe(expected)
  })
})
