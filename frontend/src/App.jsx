import { useState, useEffect } from 'react';
import { Button } from 'antd'
import React from 'react';
import { DownOutlined, SmileOutlined } from '@ant-design/icons';
import { Dropdown, Space } from 'antd';
import { Select } from 'antd';
import { Table } from "antd";
import { Checkbox, Form, Input } from 'antd';
import { Popconfirm, message } from "antd";
const TextArea = Input
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
} from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="guide" element={<Guide />} />
        <Route path="configuration" element={<Configuration />} />
      </Routes>
    </BrowserRouter>
  );
}

function NavBar() {
  return (
    <div>
      <hr />
      <Link to="/">Home</Link>
      {' | '}
      <Link to="/guide">Prompting Guide</Link>
      {' | '}
      <Link to="/configuration">Configuration</Link>
      <hr />
    </div>
  );
}

function Greeter({ name }) {
  return (
    <h1>
      Hello
      {' '}
      {name}
    </h1>
  );
}

function Counter() {
  const [count, setCount] = useState(0);
  function increment() {
    console.log(count);
    setCount((c) => c + 1);
    console.log(count);
  }
  return (
    <>
      <p>
        Counter =
        {count}
      </p>

      <Button type="primary" onClick={increment}>
        Add 1
      </Button>
    </>
  );
}

function Clock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div>
      <p>
        Time:
        {time.toLocaleTimeString()}
      </p>
    </div>
  );
}

async function getJoke() {
  let jokeText = 'No joke for you!';
  try {
    const joke = await fetch('https://icanhazdadjoke.com/', { headers: { Accept: 'text/plain' } });
    jokeText = await joke.text();
    console.log(jokeText);
  } catch {
    console.log("Something's wrong!");
  }
  return jokeText;
}



function Joke() {
  const [myJoke, setMyJoke] = useState('No Joke yet');

  useEffect(() => {
    async function fetchJoke() {
      const j = await getJoke();
      setMyJoke(j);
    }
    fetchJoke();
  }, []);
  return (
    <p>
      {myJoke}
    </p>
  );
}

async function getPokemon(setMyPokemon) {
  setMyPokemon({});





  // Get the Pokedex's upper Pokemon limit
  // Send a GET request to get the amount of Pokemon we have to work with.
  // Data endpoint: https://pokeapi.co/api/v2/pokemon-species/?limit=0
  // We will use this to generate a random number within the boundaries
  let maxNumber = 0;
  let details = null;

  const allDataReq = await fetch('https://pokeapi.co/api/v2/pokemon-species/?limit=0');
  const allData = await allDataReq.json();
  console.log(allData.count);



  // Send a new GET request to get information about that Pokemon.
  // Data endpoint: https://pokeapi.co/api/v2/pokemon/{integer}
  let pokemon = null;
  let actualPokemon = null;
  let actualNumber = Math.floor(Math.random() * allData.count);
  console.log(actualNumber);
  try {
    pokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${actualNumber}`);
    actualPokemon = await pokemon.json();
    console.log(JSON.stringify(actualPokemon))
  } catch (e) {
    console.log("Something's wrong!" + e);
  }
  console.log(actualPokemon);
  console.log(actualPokemon.sprites.back_default)

  setMyPokemon(actualPokemon);
  // Save this data somewhere!
}



function Pokemon() {
  const [myPokemon, setMyPokemon] = useState({});

  useEffect(() => {
    getPokemon(setMyPokemon);
  }, []);
  console.log(myPokemon)


  return (
    <>
      {/* Can we wait for the data fetch to complete before loading the content? */}
      <div>
        My randomly selected pokemon was {(myPokemon.name)} with a height of {JSON.stringify(myPokemon.height)}!
      </div>
      {myPokemon.sprites &&
        (
          <img
            alt="image of Pokemon"
            src={myPokemon.sprites.other['official-artwork'].front_default} />
        )}

    </>
  );
}



async function getPrompts(setPromptGuides) {

  let prompts = await fetch('/api/prompt_guides');
  let data = await prompts.json();
  console.log(data.prompt_guides[0].prompts);
  setPromptGuides(data.prompt_guides)


}


function Home() {
  return (
    <div>
      <h2>Home</h2>
      <NavBar />
      <Greeter name="Arjun" />
      <Counter />
      <Clock />
      <Joke />
      <Pokemon />
    </div>
  );
}
async function onPromptGuideChange(value) {
  console.log(`selected ${value}`);
  let req = await fetch(`/api/prompt_guide?prompt_id=${String(value)}`);
  let data = await req.json()
  console.log(data)




};


function Guide() {
  const [promptGuides, setPromptGuides] = useState([]);
  const [promptGuideId, setPromptGuideId] = useState('');
  const [currentGuide, setCurrentGuide] = useState({});
  const [currResponse, setCurrentResponse] = useState('');
  useEffect(() => {
    getPrompts(setPromptGuides);
  }, []);
  function onPromptGuideChange(value) {
    console.log(value);
    setPromptGuideId(value);
    const guide = promptGuides.find((pg) => (pg.id === value));
    console.log(guide);
    setCurrentGuide(guide);

  }
  async function onFinish(values) {
    console.log(values);
    const sendGuide = JSON.parse(JSON.stringify(currentGuide));
    const titles = Object.keys(values);
    console.log(titles);
    titles.forEach((title) => {
      const prompt = sendGuide.prompts.find((p) => (p.title === title));
      console.log({ title, prompt });
      prompt.value = values[title];
    });
    console.log(sendGuide);
    const toSend = JSON.stringify(sendGuide);
    const url = '/api/send'
    const response = await fetch(url, {
      method: 'POST',
      cache: "no-cache",
      headers: {
        'Content-Type': 'application/json',
      },
      body: toSend,


    })

    const responseData = await response.json();
    console.log(JSON.stringify(responseData))
    console.log(JSON.stringify(responseData.ai_response))
    setCurrentResponse(JSON.stringify(responseData.ai_response));


  }
  function onFinishFailed() { }

  return (
    <div>
      <h2>Prompting Guide</h2>
      <NavBar />
      <Select
        placeholder="Select a Guide"
        style={{
          width: 420,
        }}
        value={promptGuideId}
        onChange={onPromptGuideChange}
        options={promptGuides.map((pg) => ({ value: pg.id, label: pg.name }))}
      />
      {currentGuide.prompts && (
        <Form
          name="basic"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          style={{
            maxWidth: 600,
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          {currentGuide.prompts.map((p) => (
            <Form.Item
              label={p.title}
              name={p.title}
            >
              {(p.type === 'text') && (
                <Input
                  placeholder={p.description}
                />
              )}
              {(p.type === 'long text') && (
                <TextArea rows={4} placeholder={p.description} />
              )}
              {(p.type === 'select') && (
                <Select
                  placeholder={p.description}
                  options={p.choices.split(',').map((ch) => ({ value: ch, label: ch }))}
                />
              )}
            </Form.Item>
          ))}
          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      )}
      {currResponse !== '' && (
        <p>AI Response: {currResponse} </p>
      )}
    </div>
  );
}

function Configuration() {

  const confirm = (e) => {
    console.log(e);
    message.success('Click on Yes');
  };
  const cancel = (e) => {
    console.log(e);
    message.error('Click on No');
  };


  const [currentGuide, setCurrentGuide] = useState({ prompts: [] })
  const [promptGuides, setPromptGuides] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editPrompt, setEditPrompt] = useState({})
  const [promptForm] = Form.useForm();
  const [showCreateGuide, setShowCreateGuide] = useState(false)
  const [newGuideName, setNewGuideName] = useState('')
  const [promptGuideId, setPromptGuideId] = useState('');
  useEffect(() => {
    getPrompts(setPromptGuides)


  }, []);

  function onPromptGuideChange(value) {
    console.log(`selected ${value}`);
    setPromptGuideId(value)
    const isValid = (promptGuide) => promptGuide.id === value;
    promptGuides.findIndex(isValid);
    console.log(promptGuides.findIndex(isValid))
    console.log(promptGuides[promptGuides.findIndex(isValid)]);
    setCurrentGuide(promptGuides[promptGuides.findIndex(isValid)])
    setEditIndex(null);
  }

  function onEditPrompt(idx) {
    console.log(idx);
    setEditIndex(idx);
    setEditPrompt(currentGuide.prompts[idx])
    promptForm.setFieldsValue({ choices: '', ...currentGuide.prompts[idx] });

    let currGuide = promptGuides[idx];
    console.log(currGuide);

    return (
      currGuide

    )





  }
  async function savePromptGuide(guide) {
    const url = '/api/prompt_guide'
    const response = await fetch(url, {
      method: 'POST',
      cache: "no-cache",
      headers: {
        'Content-Type': 'application/json',
      },
      body: 'Please disclude all escape sequences like /n' + JSON.stringify(guide),


    })
    console.log(response)
    return response;

  }
  async function onDeletePrompt(idx) {
    console.log(idx);


    setCurrentGuide((cg) => {
      const newGuide = JSON.parse(JSON.stringify(cg));
      newGuide.prompts.splice(idx, 1);
      return (newGuide);
    });
    const newGuide = JSON.parse(JSON.stringify(currentGuide));
    newGuide.prompts.splice(idx, 1);
    await savePromptGuide(newGuide);
    getPrompts(setPromptGuides)

  }
  const columns = [
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description'


    },
    {
      title: 'Tag',
      dataIndex: 'tag',
      key: 'tag'


    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title'


    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type'


    },
    {
      title: 'Choices',
      dataIndex: 'choices',
      key: 'choices'


    },
    {
      title: 'Action',
      key: 'action',
      render: (_text, _record, idx) => (
        <Space size="middle">




          <Button key="editButton" type="link" onClick={() => onEditPrompt(idx)}> Edit </Button>
          <Popconfirm title="Delete the prompt" description="Are you sure to delete this prompt?" onConfirm={() => onDeletePrompt(idx)} onCancel={cancel} okText="Yes" cancelText="No">
            <Button key="deleteButton" type="link" danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  async function postData(values) {

    const response = await fetch('/api/prompt_guide', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),


    })
    let result = await response.json();
    console.log(result);
  }


  const onFinish = async (values) => {
    console.log('Success:', values);
    // don't know what to pass in : postData();
    //update currentGuide.prompts[idx]

    setCurrentGuide((cg) => {
      const ncg = JSON.parse(JSON.stringify(cg));
      ncg.prompts[editIndex] = values;

      return (ncg);


    })
    const ncg = JSON.parse(JSON.stringify(currentGuide));
    ncg.prompts[editIndex] = values;
    await savePromptGuide(ncg);
    getPrompts(setPromptGuides)
    setEditIndex(null);




  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);

  };
  const defaultPrompt = {
    title: '',
    description: '',
    type: 'text',
    tag: '',
    choices: '',
  };
  function onAddPrompt() {
    const newIndex = currentGuide.prompts.length;

    setEditIndex(newIndex);
    promptForm.setFieldValue(defaultPrompt);


  }

  function onShowNewGuide() {
    setShowCreateGuide(true)
    setCurrentGuide({})
    setEditIndex(null)

  }
  async function onCreateNewGuide() {
    console.log(newGuideName);
    const newGuide = {
      name: newGuideName,
      prompts: [],
    };
    const url = '/api/prompt_guide'
    const response = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newGuide),


    })
    console.log(response);
    const responseData = await response.json();
    console.log(responseData);
    const { id } = responseData;
    newGuide.id = id;
    setPromptGuides((pg) => {
      const npg = JSON.parse(JSON.stringify(pg));
      npg.push(newGuide);
      return (npg);
    });
    console.log(newGuide);
    setCurrentGuide(newGuide);
    setEditIndex(null);





  }
  function onCancelNewGuide() {
    setShowCreateGuide(false)
  }

  function onGuideNameChange(event) {
    const { value } = event.target;

    setNewGuideName(value);

  }

  function onCancelNewGuide() {
    setShowCreateGuide(false)
  }
  return (
    <div>
      <h2>Prompt Configuration</h2>
      <NavBar />
      {!showCreateGuide && (<>
        <Select
          placeholder="Select a Guide"
          style={{
            width: 420,
          }}
          value={promptGuideId}
          onChange={onPromptGuideChange}
          options={promptGuides.map((pg) => ({ "value": pg.id, "label": pg.name }))}
        />
        {' '}
        <Button type="primary" onClick={onShowNewGuide}> Add Guide </Button>
        <Space />
      </>)}

      {showCreateGuide && (<>
        <Space />
        <Input id="name" value={newGuideName} onChange={onGuideNameChange} placeholder="Enter Guide Name" style={{ width: 420 }} />
        <Button type="primary" onClick={onCreateNewGuide}> Create New Guide </Button>
        <Button type="secondary" onClick={onCancelNewGuide}> Cancel</Button>

      </>)}

      {/* {
        promptGuides[0] &&
        (
          <p>
            {JSON.stringify(promptGuides)}
          </p>
        )
      } */}

      <br />
      <p />


      {currentGuide.prompts && (editIndex === null) && (
        <>
          <Table
            dataSource={currentGuide.prompts.map((p) => ({ ...p, key: p.title }))}
            columns={columns}
          />
          <Button type="primary" onClick={onAddPrompt}>Add Prompt</Button>
        </>
      )}






      {((editIndex !== null) && (
        <>

          <Form
            name="basic"
            form={promptForm}
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
            style={{
              maxWidth: 600,
            }}
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="Description"
              name="description"

            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Tag"
              name="tag"

            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Title"
              name="title"

            >
              <Input />
            </Form.Item>
            <Form.Item name="type" label="Select">
              <Select
                options={[
                  {
                    value: 'text',
                    label: 'text',
                  },
                  {
                    value: 'LongText',
                    label: 'LongText',
                  },
                  {
                    value: 'select',
                    label: 'select',
                  },
                ]}
              />
            </Form.Item>
            <Form.Item
              label="Choices"
              name="choices"


            >
              <Input />
            </Form.Item>




            <Form.Item
              wrapperCol={{
                offset: 8,
                span: 16,
              }}
            >
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
              <Space />
              <Button type="secondary" htmlType="button" onClick={() => setEditIndex(null)}>
                Cancel
              </Button>

            </Form.Item>
          </Form>
        </>
      ))}

    </div>

  );


}


export default App;
