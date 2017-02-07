/*
Licensed to the Apache Software Foundation (ASF) under one
or more contributor license agreements.  See the NOTICE file
distributed with this work for additional information
regarding copyright ownership.  The ASF licenses this file
to you under the Apache License, Version 2.0 (the
"License"); you may not use this file except in compliance
with the License.  You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing,
software distributed under the License is distributed on an
"AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, either express or implied.  See the License for the
specific language governing permissions and limitations
under the License.
*/

package main

import (
	"errors"
	"fmt"
	"strconv"
	"encoding/json"
	"strings"
	"github.com/hyperledger/fabric/core/chaincode/shim"
)

// SimpleChaincode example simple Chaincode implementation
type SimpleChaincode struct {
}

var propertyIndexStr = "_propertyindex"				//name for the key/value that will store a list of all known properties

type Property struct{
	Owner_Name string `json:"name"`					//the fieldtags are needed to keep case from bouncing around
	Aadhar_no string `json:"adhaar_no"`
	Survey_no string `json:"survey_no"`
	Location string `json:"location"`
	Area string `json:"area"`
}

// ============================================================================================================================
// Main
// ============================================================================================================================
func main() {
	err := shim.Start(new(SimpleChaincode))
	if err != nil {
		fmt.Printf("Error starting Simple chaincode: %s", err)
	}
}

// ============================================================================================================================
// Init - reset all the things
// ============================================================================================================================
func (t *SimpleChaincode) Init(stub shim.ChaincodeStubInterface, function string, args []string) ([]byte, error) {
	var Aval int
	var err error

	if len(args) != 1 {
		return nil, errors.New("Incorrect number of arguments. Expecting 1")
	}

	// Initialize the chaincode
	Aval, err = strconv.Atoi(args[0])
	if err != nil {
		return nil, errors.New("Expecting integer value for asset holding")
	}

	// Write the state to the ledger
	err = stub.PutState("abc", []byte(strconv.Itoa(Aval)))				//making a test var "abc", I find it handy to read/write to it right away to test the network
	if err != nil {
		return nil, err
	}
	
	var empty []string
	jsonAsBytes, _ := json.Marshal(empty)								//marshal an emtpy array of strings to clear the index
	err = stub.PutState(propertyIndexStr, jsonAsBytes)
	if err != nil {
		return nil, err
	}
		
	return nil, nil
}

// ============================================================================================================================
// Run - Our entry point for Invocations - [LEGACY] obc-peer 4/25/2016
// ============================================================================================================================
func (t *SimpleChaincode) Run(stub shim.ChaincodeStubInterface, function string, args []string) ([]byte, error) {
	fmt.Println("run is running " + function)
	return t.Invoke(stub, function, args)
}

// ============================================================================================================================
// Invoke - Our entry point for Invocations
// ============================================================================================================================
func (t *SimpleChaincode) Invoke(stub shim.ChaincodeStubInterface, function string, args []string) ([]byte, error) {
	fmt.Println("invoke is running " + function)

	// Handle different functions
	if function == "init" {													//initialize the chaincode state, used as reset
		return t.Init(stub, "init", args)
	} else if function == "write" {											//writes a value to the chaincode state
		return t.Write(stub, args)
	} else if function == "register" {									//create a new marble
		return t.Register(stub, args)
	} else if function == "transfer" {									//create a new marble
		return t.transfer(stub, args)
	} 
	fmt.Println("invoke did not find func: " + function)					//error

	return nil, errors.New("Received unknown function invocation")
}

// ============================================================================================================================
// Query - Our entry point for Queries
// ============================================================================================================================
func (t *SimpleChaincode) Query(stub shim.ChaincodeStubInterface, function string, args []string) ([]byte, error) {
	fmt.Println("query is running " + function)

	// Handle different functions
	if function == "read" {													//read a variable
		return t.read(stub, args)
	}
	fmt.Println("query did not find func: " + function)						//error

	return nil, errors.New("Received unknown function query")
}

// ============================================================================================================================
// Read - read a variable from chaincode state
// ============================================================================================================================
func (t *SimpleChaincode) read(stub shim.ChaincodeStubInterface, args []string) ([]byte, error) {
	var name, jsonResp string
	var err error

	if len(args) != 1 {
		return nil, errors.New("Incorrect number of arguments. Expecting name of the var to query")
	}

	name = args[0]
	valAsbytes, err := stub.GetState(name)									//get the var from chaincode state
	if err != nil {
		jsonResp = "{\"Error\":\"Failed to get state for " + name + "\"}"
		return nil, errors.New(jsonResp)
	}

	return valAsbytes, nil													//send it onward
}


// ============================================================================================================================
// Write - write variable into chaincode state
// ============================================================================================================================
func (t *SimpleChaincode) Write(stub shim.ChaincodeStubInterface, args []string) ([]byte, error) {
	var name, value string // Entities
	var err error
	fmt.Println("running write()")

	if len(args) != 2 {
		return nil, errors.New("Incorrect number of arguments. Expecting 2. name of the variable and value to set")
	}

	name = args[0]															//rename for funsies
	value = args[1]
	err = stub.PutState(name, []byte(value))								//write the variable into the chaincode state
	if err != nil {
		return nil, err
	}
	return nil, nil
}

// ============================================================================================================================
// Register property - create a new property, store into chaincode state
// ============================================================================================================================
func (t *SimpleChaincode) Register(stub shim.ChaincodeStubInterface, args []string) ([]byte, error) {
	var err error

	//   0       1              2            3            4
	// "deeps", "1212-14-13", "534656-55", "pachgaon",  "kop"
	
	if len(args) != 5 {
		return nil, errors.New("Incorrect number of arguments. Expecting 5")
	}

	//input sanitation
	fmt.Println("- start registration of property")
	if len(args[0]) <= 0 {
		return nil, errors.New("1st argument must be a non-empty string")
	}
	if len(args[1]) <= 0 {
		return nil, errors.New("2nd argument must be a non-empty string")
	}
	if len(args[2]) <= 0 {
		return nil, errors.New("3rd argument must be a non-empty string")
	}
	if len(args[3]) <= 0 {
		return nil, errors.New("4th argument must be a non-empty string")
	}
	if len(args[4]) <= 0 {
		return nil, errors.New("5th argument must be a non-empty string")
	}
	name := args[0]
	adhaar_no := args[1]
	survey_no := args[2]
	location := args[3]
	area := args[4]
	
	//if err != nil {
	//	return nil, errors.New("3rd argument must be a numeric string")
	//}

	//check if marble already exists
	propertyAsBytes, err := stub.GetState(name)
	if err != nil {
		return nil, errors.New("Failed to get property")
	}
	
	res := Property{}
	json.Unmarshal(propertyAsBytes, &res)
	if res.Survey_no == survey_no{
		fmt.Println("This property arleady exists: " + survey_no)
		fmt.Println(res);
		return nil, errors.New("This property arleady exists")				//all stop a property by this name exists
	}
	
	//build the property json string manually
	str := `{"name": "` + name + `", "adhaar_no": "` + adhaar_no + `", "survey_no": ` + survey_no + `, "location": "` + location +  `, "area": "` + area + `"}`
	err = stub.PutState(survey_no, []byte(str))									//store marble with id as key
	if err != nil {
		return nil, err
	}
		
	//get the property index
	propertyAsBytes, err = stub.GetState(propertyIndexStr)
	if err != nil {
		return nil, errors.New("Failed to get property index")
	}
	var propertyIndex []string
	json.Unmarshal(propertyAsBytes, &propertyIndex)							//un stringify it aka JSON.parse()
	
	//append
	propertyIndex = append(propertyIndex, name)									//add marble name to index list
	fmt.Println("! property index: ", propertyIndex)
	jsonAsBytes, _ := json.Marshal(propertyIndex)
	err = stub.PutState(propertyIndexStr, jsonAsBytes)						//store name of marble

	fmt.Println("- end register")
	return nil, nil
}

func (t *SimpleChaincode) transfer(stub shim.ChaincodeStubInterface, args []string) ([]byte, error) {
	var err error
	
	//	0		1			 2	
	//[data.name, data.survey_no, data.new_name]
	
	if len(args) < 3 {
		return nil, errors.New("Incorrect number of arguments. Expecting 3")
	}

	name := strings.TrimSpace(args[1])
	new_name := strings.TrimSpace(args[2])
	survey_no := strings.TrimSpace(args[0])

	propertyAsBytes, err := stub.GetState(name)
	if err != nil {
		return nil, errors.New("Failed to get property")
	}
	
	res := Property{}
	json.Unmarshal(propertyAsBytes, &res)

	if strings.ToLower(strings.TrimSpace(res.Survey_no))==strings.ToLower(strings.TrimSpace(survey_no)) {
		fmt.Println("This property arleady exists: " + survey_no)
		fmt.Println(res);
		return nil, errors.New("This property arleady exists")				//all stop a property by this name exists
	}
			
	res.Owner_Name = new_name														//change the user

	//build the property json string manually
	str := `{"name": "` + new_name + `", "survey_no": ` + survey_no + `"}`
	err = stub.PutState(survey_no, []byte(str))									//store marble with id as key
	if err != nil {
		return nil, err
	}
		
	//get the property index
	propertyAsBytes, err = stub.GetState(propertyIndexStr)
	if err != nil {
		return nil, errors.New("Failed to get property index")
	}
	var propertyIndex []string
	json.Unmarshal(propertyAsBytes, &propertyIndex)							//un stringify it aka JSON.parse()
	
	//append
	propertyIndex = append(propertyIndex, name)									//add marble name to index list
	fmt.Println("! property index: ", propertyIndex)
	jsonAsBytes, _ := json.Marshal(propertyIndex)
	err = stub.PutState(propertyIndexStr, jsonAsBytes)						//store name of marble

	fmt.Println("- end transfer")
	return nil, nil
}

