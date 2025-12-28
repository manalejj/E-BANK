package com.ebank.ebank_backend.aspects;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;
import java.util.logging.Logger;

@Aspect
@Component
public class LogAspect {
    private Logger logger = Logger.getLogger(LogAspect.class.getName());

    // This triggers automatically AFTER any method in BankService finishes
    @AfterReturning(pointcut = "execution(* com.ebank.ebank_backend.services.BankService.*(..))")
    public void logMethodCall(JoinPoint joinPoint) {
        String methodName = joinPoint.getSignature().getName();
        logger.info(">>> [AOP LOG] Succès de l'opération : " + methodName);
    }
}