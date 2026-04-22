namespace wordslayer.Tests;

using backend;

public class UnitTest1
{
    [Fact]
    public void Test1()
    {
        // setup 
        Test newTest = new Test(120);
        int getingInteger = newTest.getNumber();

        Assert.Equal(120, getingInteger);
    }

}
