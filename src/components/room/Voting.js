import {useState, useEffect} from 'react'
import { database } from '../../firebase'
import {Card, Modal} from 'react-bootstrap'

import Question from './Question'
import './Voting.scss'

export default function Voting({roomId}) {

    const [votingQuestions, setVotingQuestions] = useState(null)
    const [publicKey, setPublicKey] = useState(null)
    //Display Modal
    const [show, setShow] = useState('false')
    const handleShow = (key) => setShow(key)
    const handleHide = () => setShow('false')

    function votingWasCreate(time){
        const oneDay = 86400000 // in miliseconds
        return Math.floor((Date.now()/oneDay)-(time/oneDay))
    }

    useEffect(() => {
        database.ref(`rooms/${roomId}/public/vote`).on("value", (voteSnapShot) => {
            setVotingQuestions(voteSnapShot.val())
        })
        return () => {
            database.ref(`rooms/${roomId}/vote`).off()
        }
    }, [roomId])


    useEffect(() => {
        database.ref(`rooms/${roomId}/public/publicKey`).get().then(function(publicKeySnapShot){
            setPublicKey(publicKeySnapShot.val())
        })

    }, [roomId])


    return (
        <div className="Voting">
            <p className="voting-title">Questions</p>

            <div className="voting-questions">
                <ul className="voting-questionsList" >
                    {votingQuestions !== null && Object.keys(votingQuestions).map(key =>
                        
                        <div key={key}> 
                        <Card className="text-center questionsList-card" >
                            <Card.Header>Question</Card.Header>
                            <Card.Body>
                                <Card.Title className="questionsList-question">{votingQuestions[key].question}</Card.Title>
                                <Card.Text className="questionsList-countVoted">
                                    Voted: {2}/{23}<br/>
                                    Status: {votingQuestions[key].status}
                                </Card.Text>
                                <button className="questionsList-button" onClick={() => handleShow(key)}>Vote on the question</button>
                            </Card.Body>
                            <Card.Footer className="questionsList-time">{votingWasCreate(votingQuestions[key].timeCreate)} days ago </Card.Footer>
                        </Card>

                        <Modal className="questionModal" show={key === show} onHide={handleHide} animation={false} >
                            <Modal.Header closeButton>
                                <Modal.Title className="questionModal-title">Question: {votingQuestions[key].question}</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Question props={votingQuestions[key]} publicKey={publicKey}/>
                            </Modal.Body>
                        </Modal>

                        </div>

                    )}
                </ul>
            </div>   

        </div>
    )
}
